from django.shortcuts import render
from rest_framework import generics, mixins, permissions
from drf_yasg.utils import swagger_auto_schema
from .models import Card, Tag, Collection, CardImage, Announcement
from .serializers import CardSerializer, TagSerializer, CollectionSerializer


# Create your views here.

class CardAPIView(generics.GenericAPIView,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get all cards",
        responses={200: CardSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new card",
        request_body=CardSerializer,
        responses={201: CardSerializer()}
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return self.create(request)


class CardDetailAPIView(generics.GenericAPIView,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def get_permissions(self):
        method = self.request.method
        if method == 'DELETE':
            return [permissions.IsAdminUser()]
        else:
            return [permissions.IsAuthenticated()]

    @swagger_auto_schema(
        operation_description="Get a card by ID",
        responses={200: CardSerializer()}
    )
    def get(self, request, pk):
        return self.retrieve(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Update a card",
        request_body=CardSerializer,
        responses={200: CardSerializer()}
    )
    def put(self, request, pk):
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete a card"
    )
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)


class CardByAnnouncementAPIView(generics.GenericAPIView,
                                mixins.ListModelMixin):
    serializer_class = CardSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        announcement_id = self.kwargs.get('announcement_id')
        return Card.objects.filter(announcement_id=announcement_id)

    @swagger_auto_schema(
        operation_description="Get all cards for a specific announcement",
        responses={200: CardSerializer(many=True)}
    )
    def get(self, request, announcement_id):
        return self.list(request, announcement_id=announcement_id)


class CardSearchAPIView(generics.GenericAPIView,
                        mixins.ListModelMixin):
    serializer_class = CardSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        tags = self.request.query_params.getlist('tags')
        collection = self.request.query_params.get('collection')
        condition = self.request.query_params.get('condition')

        queryset = Card.objects.all()

        if tags:
            queryset = queryset.filter(tags__name__in=tags).distinct()

        if collection:
            queryset = queryset.filter(collection__name=collection)

        if condition:
            queryset = queryset.filter(condition=condition)

        return queryset

    @swagger_auto_schema(
        operation_description="Search cards by tags, collection, and condition",
        responses={200: CardSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)


class TagAPIView(generics.GenericAPIView,
                 mixins.ListModelMixin,
                 mixins.CreateModelMixin):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get all tags",
        responses={200: TagSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new tag",
        request_body=TagSerializer,
        responses={201: TagSerializer()}
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return self.create(request)


class TagDetailAPIView(generics.GenericAPIView,
                       mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin,
                       mixins.DestroyModelMixin):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get a tag by ID",
        responses={200: TagSerializer()}
    )
    def get(self, request, pk):
        return self.retrieve(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Update a tag by ID",
        request_body=TagSerializer,
        responses={200: TagSerializer()}
    )
    def put(self, request, pk):
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete a tag by ID"
    )
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)


class CollectionAPIView(generics.GenericAPIView,
                        mixins.ListModelMixin,
                        mixins.CreateModelMixin):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get all collections",
        responses={200: CollectionSerializer(many=True)}
    )
    def get(self, request):
        return self.list(request)

    @swagger_auto_schema(
        operation_description="Create a new collection",
        request_body=CollectionSerializer,
        responses={201: CollectionSerializer()}
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return self.create(request)


class CollectionDetailAPIView(generics.GenericAPIView,
                              mixins.RetrieveModelMixin,
                              mixins.UpdateModelMixin,
                              mixins.DestroyModelMixin):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        operation_description="Get a collection by ID",
        responses={200: CollectionSerializer()}
    )
    def get(self, request, pk):
        return self.retrieve(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Update a collection by ID",
        request_body=CollectionSerializer,
        responses={200: CollectionSerializer()}
    )
    def put(self, request, pk):
        return self.update(request, pk=pk)

    @swagger_auto_schema(
        operation_description="Delete a collection by ID"
    )
    def delete(self, request, pk):
        return self.destroy(request, pk=pk)
