import openai
import tiktoken

openai.api_key = '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'

model = "gpt-3.5-turbo-0613"

chat_completion = openai.ChatCompletion.create(model=model, messages=[{"role": "user", "content": "Hello world"}])

print(chat_completion)

def num_tokens_from_messages(messages, model):
  """Returns the number of tokens used by a list of messages."""
  try:
      encoding = tiktoken.encoding_for_model(model)
  except KeyError:
      encoding = tiktoken.get_encoding("cl100k_base")
  if model == "gpt-3.5-turbo-0613":  # note: future models may deviate from this
      num_tokens = 0
      for message in messages:
          num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
          for key, value in message.items():
              num_tokens += len(encoding.encode(value))
              if key == "name":  # if there's a name, the role is omitted
                  num_tokens += -1  # role is always required and always 1 token
      num_tokens += 2  # every reply is primed with <im_start>assistant
      return num_tokens
  else:
      raise NotImplementedError(f"""num_tokens_from_messages() is not presently implemented for model {model}.
  See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.""")