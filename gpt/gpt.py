import openai
import tiktoken

openai.api_key = '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'

model = "gpt-3.5-turbo-0613"




def create_question(content):
    """Creates question to the provided paragraph."""
    messages=[
              {"role": "system", "content": "Вы являетесь преподавателем, который задает вопросы к параграфу, предоставленному студентом, а в конце говорите ответ. Важно, чтобы вопрос состоял из одного предложения."},
              {"role": "user", "content": """Метод, который Альтман использовал, когда обнаружил нейрогенез взрослых (и который мы подробно опишем в следующей главе), широко применялся уже несколько лет, к тому времени с ним были проведены весьма результативные исследования, а кроме того, он позволял ответить на вопрос, где именно в процессе развития мозга происходит клеточное деление. Скорее всего, Альтман был первым, кто использовал этот метод на взрослом мозге. Собственно говоря, для этого не было никаких оснований, разве что можно было использовать его как отрицательный контроль [6] для каких-то совершенно иных процессов. Проведенные на тот момент исследования давно уже показали, что деление клеток по окончании развития организма, «несомненно», прекращается. По крайней мере, почти, но на нюансы никто не обращал внимания."""},
              {"role": "assistant", "content": "Вопрос: Что Альтман обнаружил и где использовал метод, благодоря которому обнаружил это? Ответ: Альтман обнаружил нейрогенез взрослых, благодоря тому, что использовал методику на взрослом мозге."},
              {"role": "user", "content": content}]
    
    chat_completion = openai.ChatCompletion.create(model=model, messages=messages)
    return chat_completion['choices'][0]['message']['content']

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