from minio import Minio
from django.conf import settings
from minio.error import S3Error
import io

minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_EXTERNAL_ENDPOINT_USE_HTTPS
)


def create_bucket(bucket_name):
    try:
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
        return True
    except S3Error as err:
        print(f"Error occurred: {err}")
        return False


def upload_image(file, upload_to, bucket_name=settings.MINIO_MEDIA_FILES_BUCKET):
    try:
        if not minio_client.bucket_exists(bucket_name):
            create_bucket(bucket_name)

        file_data = file.read()
        file_name = file.name
        file_size = len(file_data)
        file_stream = io.BytesIO(file_data)
        minio_client.put_object(bucket_name, upload_to + file_name, file_stream, file_size)
        return file_name
    except S3Error as err:
        print(f"Error occurred: {err}")
        return None


def get_image_url(file_name, upload_from, bucket_name=settings.MINIO_MEDIA_FILES_BUCKET):
    try:
        url = minio_client.presigned_get_object(bucket_name, upload_from + file_name)
        return url
    except S3Error as err:
        print(f"Error occurred: {err}")
        return None


def delete_image(file_name, upload_from, bucket_name=settings.MINIO_MEDIA_FILES_BUCKET):
    try:
        minio_client.remove_object(bucket_name, upload_from + file_name)
        return True
    except S3Error as err:
        print(f"Error occurred: {err}")
        return False
