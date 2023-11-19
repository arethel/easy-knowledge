import re
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import time

WHITESPACE_HANDLER = lambda k: re.sub('\s+', ' ', re.sub('\n+', ' ', k.strip()))

article_text = """Videos that say approved vaccines are dangerous and cause autism, cancer or infertility are among those that will be taken down, the company said.  The policy includes the termination of accounts of anti-vaccine influencers.  Tech giants have been criticised for not doing more to counter false health information on their sites.  In July, US President Joe Biden said social media platforms were largely responsible for people's scepticism in getting vaccinated by spreading misinformation, and appealed for them to address the issue.  YouTube, which is owned by Google, said 130,000 videos were removed from its platform since last year, when it implemented a ban on content spreading misinformation about Covid vaccines.  In a blog post, the company said it had seen false claims about Covid jabs "spill over into misinformation about vaccines in general". The new policy covers long-approved vaccines, such as those against measles or hepatitis B.  "We're expanding our medical misinformation policies on YouTube with new guidelines on currently administered vaccines that are approved and confirmed to be safe and effective by local health authorities and the WHO," the post said, referring to the World Health Organization."""

model_name = "csebuetnlp/mT5_m2m_crossSum_enhanced"
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

get_lang_id = lambda lang: tokenizer._convert_token_to_id(
    model.config.task_specific_params["langid_map"][lang][1]
) 

target_lang = "english" # for a list of available language names see below

time_start = time.time()

input_texts = [
    """Videos that say approved vaccines are dangerous and cause autism, cancer or infertility are among those that will be taken down, the company said.  The policy includes the termination of accounts of anti-vaccine influencers.  Tech giants have been criticised for not doing more to counter false health information on their sites.  In July, US President Joe Biden said social media platforms were largely responsible for people's scepticism in getting vaccinated by spreading misinformation, and appealed for them to address the issue.  YouTube, which is owned by Google, said 130,000 videos were removed from its platform since last year, when it implemented a ban on content spreading misinformation about Covid vaccines.  In a blog post, the company said it had seen false claims about Covid jabs "spill over into misinformation about vaccines in general". The new policy covers long-approved vaccines, such as those against measles or hepatitis B.  "We're expanding our medical misinformation policies on YouTube with new guidelines on currently administered vaccines that are approved and confirmed to be safe and effective by local health authorities and the WHO, the post said, referring to the World Health Organization.""",
    """Dear Trader, 

Welcome to Bybit! You've picked the perfect time to hop onboard. 

As a token of our gratitude and to help you kickstart your journey with us, we have a special offer lined up just for you. 

Here's how you can grab your welcome rewards:
Register for the event by Dec 31, 2023, 10AM UTC
Deposit $100 or more in any currency via Fiat Deposit or One-Click Buy within seven (7) days of registering for the event
Trade any amount on Spot or Derivatives. 
Get rewarded

We'll airdrop you 10 USDT within 10 working days of you meeting the eligible deposit and trading requirements. """,
    # Add more input texts as needed
]

# Tokenize all input texts at once
input_ids = tokenizer(
    input_texts,
    return_tensors="pt",
    padding="max_length",
    truncation=True,
    max_length=512,
    add_special_tokens=True,  # Add [CLS] and [SEP] tokens
)

# Generate summaries for all input texts
output_ids = model.generate(
    input_ids=input_ids.input_ids,  # Access the input_ids from the tokenized batch
    decoder_start_token_id=get_lang_id(target_lang),
    max_length=84,
    no_repeat_ngram_size=2,
    num_beams=4,
)

# Decode the summaries
summaries = tokenizer.batch_decode(
    output_ids,
    skip_special_tokens=True,
    clean_up_tokenization_spaces=False
)

# Print the summaries for each input text
for i, summary in enumerate(summaries):
    print(f"Summary for Input {i + 1}:")
    print(summary)

print(time.time() - time_start, "seconds")
