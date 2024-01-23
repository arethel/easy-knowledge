from django.db import models
from django.conf import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver

#todo: change the path
def book_directory_path(instance, filename):
    return 'user_{0}/original/{1}'.format(instance.user.id, filename)

def processed_book_directory_path(instance, filename):
    return 'user_{0}/processed/{1}'.format(instance.user.id, filename)

def covers_directory_path(instance, filename):
    return 'user_{0}/covers/{1}'.format(instance.user.id, filename)

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200, blank=True, null=True)
    cover_image = models.ImageField(upload_to=covers_directory_path, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateField(auto_now_add=True)
    book_file = models.FileField(upload_to=book_directory_path)
    book_section = models.ForeignKey('Section', on_delete=models.CASCADE, related_name='books', null=True)
    processed = models.BooleanField(default=False)
    index = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        if self.cover_image:
            self.cover_image.delete(False)
        self.book_file.delete(False)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['user', 'book_section', 'index']
        db_table = 'book'
        verbose_name = 'Book'
        verbose_name_plural = 'Books'

@receiver(pre_delete, sender=Book)
def delete_book_media(sender, instance, **kwargs):
    if instance.cover_image:
        instance.cover_image.delete(False)
    instance.book_file.delete(False)

class ProcessedBook(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=None)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    processed_file = models.FileField(upload_to=processed_book_directory_path)
    processed_date = models.DateField(auto_now_add=True)
    processing = models.IntegerField(default=0)
    time = models.IntegerField(default=0)
    page = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        self.processed_file.delete(False)
        super().delete(*args, **kwargs)

    class Meta:
        ordering = ['user']
        db_table = 'processed_book'
        verbose_name = 'Processed Book'
        verbose_name_plural = 'Processed Books'

@receiver(pre_delete, sender=ProcessedBook)
def delete_book_media(sender, instance, **kwargs):
    instance.processed_file.delete(False)

class Section(models.Model):
    section_name = models.CharField(max_length=200, blank=False, null=False, default='Section')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creation_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.section_name
    
    def to_dict(self):
        return {
            'section_id': self.id,
        }

    class Meta:
        ordering = ['user']
        db_table = 'section'
        verbose_name = 'Section'
        verbose_name_plural = 'Sections'

class QA(models.Model):
    page = models.IntegerField()
    block = models.IntegerField()
    generated = models.BooleanField(default=False)
    use = models.BooleanField(default=False)
    book = models.ForeignKey(ProcessedBook, on_delete=models.CASCADE)

    class Meta:
        ordering = ['book']
        db_table = 'question_answers'
        verbose_name = 'QA'
        verbose_name_plural = "QA's"

class Test(models.Model):
    book = models.ForeignKey(ProcessedBook, on_delete=models.CASCADE)
    creation_date = models.DateField(auto_now_add=True)
    qa_count = models.IntegerField(default=0)
    qa = models.ManyToManyField(QA)
    is_ready = models.BooleanField(default=False)
    
    def get_progress(self):
        progress = int(self.qa.filter(generated=True).count() / self.qa_count * 100)
        if progress == 100:
            self.is_ready = True
            self.save()
        return progress
    
    class Meta:
        ordering = ['creation_date']
        db_table = 'test'
        verbose_name = 'Test'
        verbose_name_plural = 'Tests'

class OpenedBook(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    books = models.ManyToManyField(Book, related_name='opened_books')
    last_section = models.ForeignKey(Section, null=True, default=None, on_delete=models.SET_NULL)
    last_book = models.ForeignKey(Book, null=True, default=None, on_delete=models.SET_NULL, related_name='last_opened_book')

    class Meta:
        db_table = 'opened_book'
        verbose_name = 'Opened Book'
        verbose_name_plural = 'Opened Books'

class Conversation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    model = models.CharField(max_length=200)
    system_prompt = models.TextField()
    messages = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'conversation'
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'