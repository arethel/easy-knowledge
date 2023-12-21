from pathlib import Path

from django.contrib.auth import tokens
from pdf_processing.pdf import extract_paragraphs_from_page, get_pdf_len
from gpt.gpt import create_messages, summary_template, model, num_tokens_from_messages, create_summary
import os, sys, time
import pandas as pd
import numpy as np
from threading import Thread

lang_folder = Path(os.path.dirname(os.path.realpath(__file__))) / 'dataset_processing' / 'dataset_data'

class ContentExtract:
    def __init__(self, lang_folder, max_input_tokens_amount=100_000):
        self.lang_folder = lang_folder
        self.lang_folders = [x for x in lang_folder.iterdir() if x.is_dir()]
        self.books_amount = 0
        self.books = {}
        for lang in self.lang_folders:
            self.books[lang.name] = []
            for book in lang.iterdir():
                if book.is_file():
                    self.books[lang.name].append(book)
                    self.books_amount += 1
        
        self.tokens_per_book = max_input_tokens_amount // self.books_amount
        
        self.dataset = pd.DataFrame(columns=['book', 'lang', 'page', 'content', 'len', 'tokens_amount'])
        self.saved_tokens_per_book = {}
    
    def load_dataset(self, dataset_path):
        self.dataset = pd.read_csv(dataset_path)
        return self.dataset
    
    def get_checked_pages(self, book_full_name):
        return self.dataset[self.dataset['book']+'_'+self.dataset['lang'] == book_full_name]['page'].unique()
    
    long_try = 20
    def create_dataset(self):
        for lang in self.books:
            for book in self.books[lang]:
                book_len = get_pdf_len(book)
                book_full_name = book.name+'_'+lang
                checked_pages = list(self.get_checked_pages(book_full_name))
                self.saved_tokens_per_book[book_full_name] = 0
                
                stop = False
                tryies = 0
                while self.saved_tokens_per_book[book_full_name] < self.tokens_per_book:
                
                    book_page = np.random.randint(4, int(book_len * 0.9))
                    if book_page in checked_pages:
                        tryies += 1
                        if tryies > self.long_try:
                            stop = True
                            break
                        continue
                    tryies = 0
                    checked_pages.append(book_page)
                    
                    pages = extract_paragraphs_from_page(book, book_page)
                    for page in pages:
                        for paragraph in page:
                            tokens_amount = num_tokens_from_messages(create_messages(summary_template, paragraph), model)
                            if self.saved_tokens_per_book[book_full_name]+tokens_amount > self.tokens_per_book:
                                stop = True
                                break
                            self.saved_tokens_per_book[book_full_name] += tokens_amount
                            print(book_full_name, self.saved_tokens_per_book[book_full_name], self.tokens_per_book)
                            new_row = pd.Series({'book': book.name, 'lang': lang, 'page': book_page, 'content': paragraph, 'len': len(paragraph), 'tokens_amount': tokens_amount})
                            self.dataset = pd.concat([self.dataset, new_row.to_frame().T], ignore_index=True)
                        if stop:
                            break
                    if stop:
                        break
        return self.dataset

# content_extract = ContentExtract(lang_folder, max_input_tokens_amount=1_000_000)
# content_extract.load_dataset('dataset.csv')
# content_extract.create_dataset().to_csv('dataset_2.csv', index=False, encoding='utf-8')

# ContentExtract(lang_folder).create_dataset().to_csv('dataset.csv', index=False, encoding='utf-8')

class GPTDSProcessing:
    def __init__(self, dataset_path):
        self.dataset = pd.read_csv(dataset_path)
        ds_parts = dataset_path.split('.')
        self.dataset_new_name = ds_parts[0]+'_processed.'+ds_parts[1]
        if not 'summary' in self.dataset.columns:
            self.dataset['summary'] = None
            self.dataset['summary_len'] = 0
    
    def get_summary(self, i, summary_received, tokens_used):
        time.sleep(self.wait_time_on_rate_limit*(tokens_used/self.rate_limit))
        self.dataset.at[i, 'summary'] = create_summary(self.dataset.iloc[i]['content'])
        self.dataset.at[i, 'summary_len'] = len(self.dataset.iloc[i]['summary'])
        summary_received[i]=True
    
    max_wait_time = 500
    rate_limit=20_000
    wait_time_on_rate_limit = 35
    def create_summaries(self, amount=None, auto_save = False):
        summary_received = pd.Series()
        tokens_used = 0
        for i in range(len(self.dataset)):
            if self.dataset.iloc[i]['summary'] is None or str(self.dataset.iloc[i]['summary']) == 'nan':
                tokens_used += self.dataset.iloc[i]['tokens_amount']
                summary_received[i]=False
                Thread(target=self.get_summary, args=(i, summary_received, tokens_used)).start()
                if amount is not None and len(summary_received) >= amount:
                    break
        
        last_summary_received = summary_received.sum()
        stop_timer = 0
        if amount is None:
            amount = len(summary_received)
        
        while summary_received.sum() < amount:
            print(summary_received.sum(), amount)
            if summary_received.sum() == last_summary_received:
                stop_timer += 1
            else:
                stop_timer = 0
                last_summary_received = summary_received.sum()
                if auto_save:
                    self.save_dataset()
            if stop_timer > self.max_wait_time:
                break
            time.sleep(0.5)
        return self.dataset
    
    def save_dataset(self):
        self.dataset.to_csv(self.dataset_new_name, index=False, encoding='utf-8')
        return self.dataset_new_name

# dataset_processing = GPTDSProcessing('dataset_2.csv')
# dataset_processing.create_summaries(auto_save=True)
# print(dataset_processing.dataset.head(5))
# dataset_processing.save_dataset()


class DSProcessing:
    def __init__(self, dataset_path, content_decrease_rate=0.25):
        self.dataset = pd.read_csv(dataset_path)
        self.content_decrease_rate = content_decrease_rate
        ds_parts = dataset_path.split('.')
        self.dataset_new_name = ds_parts[0]+'_checked.'+ds_parts[1]
    
    def check_summary(self, i):
        if str(self.dataset.loc[i]['summary']) == 'nan':
            self.dataset.drop(i, inplace=True)
            return True
        if self.dataset.loc[i]['summary_len'] - self.dataset.loc[i]['len']*(1-self.content_decrease_rate) > 0:
            self.dataset.drop(i, inplace=True)
            return True
        return False
    
    def check_dataset(self):
        for i in self.dataset.index:
            self.check_summary(i)
        return self.dataset
    
    def save_dataset(self):
        self.dataset.to_csv(self.dataset_new_name, index=False, encoding='utf-8')
        return self.dataset_new_name

dataset_processing = DSProcessing('dataset_2_processed.csv', content_decrease_rate=0.2)
dataset_processing.check_dataset()
dataset_processing.save_dataset()
print(len(dataset_processing.dataset))
# for row_with_summary in dataset_processing.dataset.itertuples():
#     print(row_with_summary.len, row_with_summary.summary_len)
#     print(row_with_summary.content)
#     print('+++++++')
#     print(row_with_summary.summary)
#     print('------------------')