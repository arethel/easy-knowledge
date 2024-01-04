from django.db import models
from django.conf import settings

#todo: change the path
def book_directory_path(instance, filename):
    return 'user_{0}/original/{1}'.format(instance.user.id, filename)

def processed_book_directory_path(instance, filename):
    return 'user_{0}/processed/{1}'.format(instance.user.id, filename)

class Book(models.Model):
    title = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upload_date = models.DateField(auto_now_add=True)
    book_file = models.FileField(upload_to=book_directory_path)
    book_section = models.ForeignKey('Section', on_delete=models.CASCADE, related_name='books', null=True)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['user']
        db_table = 'book'
        verbose_name = 'Book'
        verbose_name_plural = 'Books'

class ProcessedBook(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    processed_file = models.FileField(upload_to=processed_book_directory_path)
    processed_date = models.DateField(auto_now_add=True)
    processing = models.IntegerField(default=0)

    class Meta:
        ordering = ['processed_date']
        db_table = 'processed_book'
        verbose_name = 'Processed Book'
        verbose_name_plural = 'Processed Books'

class Section(models.Model):
    section_name = models.CharField(max_length=200, blank=False, null=False, default='Section')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    creation_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.section_name

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