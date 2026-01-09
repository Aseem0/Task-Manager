from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.shortcuts import get_object_or_404

from .models import Task, TaskGroup
from .serializers import TaskSerializer, TaskGroupSerializer
from users.permissions import IsAdminOrManager
from rest_framework.permissions import IsAuthenticated


def is_admin_or_manager(user):
    """Helper function to check if user is admin, manager or superuser"""
    return user.is_superuser or user.role in ['admin', 'manager']


class TaskGroupViewSet(viewsets.ModelViewSet):
    queryset = TaskGroup.objects.all()
    serializer_class = TaskGroupSerializer
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskCreateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assigned_users = serializer.validated_data.get('assigned_to', [])
        group = serializer.validated_data.get('group')

        task = Task.objects.create(
            title=serializer.validated_data['title'],
            description=serializer.validated_data.get('description'),
            status=serializer.validated_data.get('status', 'todo'),
            due_date=serializer.validated_data.get('due_date'),
            group=group,
            created_by=request.user
        )

        final_users = set(assigned_users)
        if group:
            final_users.update(group.members.all())

        task.assigned_to.set(final_users)

        return Response(
            {"message": "Task created successfully", "task": TaskSerializer(task).data},
            status=status.HTTP_201_CREATED
        )


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Admin, manager, and superusers can see all tasks
        if is_admin_or_manager(user):
            tasks = Task.objects.prefetch_related('assigned_to').all()
        else:
            tasks = Task.objects.prefetch_related('assigned_to').filter(
                assigned_to=user
            )

        return Response(TaskSerializer(tasks, many=True).data)


class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        task = get_object_or_404(Task, pk=pk)

        # Only employees need to be assigned to view a task
        if not is_admin_or_manager(request.user) and request.user not in task.assigned_to.all():
            return Response(
                {"error": "Task not assigned to you"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response(TaskSerializer(task).data)


class TaskUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_task(self, pk):
        return get_object_or_404(Task, pk=pk)

    def patch(self, request, pk):
        task = self.get_task(pk)
        user = request.user

        # Employees can only update status of their assigned tasks
        if not is_admin_or_manager(user):
            if user not in task.assigned_to.all():
                return Response({"error": "Not allowed"}, status=403)

            task.status = request.data.get('status', task.status)
            task.save()
            return Response(TaskSerializer(task).data)

        # Admin/Manager can update everything
        serializer = TaskSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        assigned_users = serializer.validated_data.get('assigned_to')
        group = serializer.validated_data.get('group')

        serializer.save()

        if assigned_users is not None or group is not None:
            final_users = set(assigned_users or [])
            if group:
                final_users.update(group.members.all())
            task.assigned_to.set(final_users)

        return Response(TaskSerializer(task).data)

    def delete(self, request, pk):
        task = self.get_task(pk)

        # Only admin/manager/superuser can delete tasks
        if not is_admin_or_manager(request.user):
            return Response(
                {"error": "Employees cannot delete tasks"},
                status=status.HTTP_403_FORBIDDEN
            )

        task.delete()
        return Response({"message": "Task deleted successfully"})
