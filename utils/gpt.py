# -*- coding: utf-8 -*-
import openai
import tiktoken

openai.api_key = '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'
model = "gpt-3.5-turbo-0613"


def create_question(content):
    """Creates question to the provided paragraph."""
    messages = [
              {"role": "system", "content": "Вы являетесь преподавателем, который задает вопросы к параграфу, предоставленному студентом, а в конце говорите ответ. Важно, чтобы вопрос состоял из одного предложения."},
              {"role": "user", "content": """Метод, который Альтман использовал, когда обнаружил нейрогенез взрослых (и который мы подробно опишем в следующей главе), широко применялся уже несколько лет, к тому времени с ним были проведены весьма результативные исследования, а кроме того, он позволял ответить на вопрос, где именно в процессе развития мозга происходит клеточное деление. Скорее всего, Альтман был первым, кто использовал этот метод на взрослом мозге. Собственно говоря, для этого не было никаких оснований, разве что можно было использовать его как отрицательный контроль [6] для каких-то совершенно иных процессов. Проведенные на тот момент исследования давно уже показали, что деление клеток по окончании развития организма, «несомненно», прекращается. По крайней мере, почти, но на нюансы никто не обращал внимания."""},
              {"role": "assistant", "content": "Вопрос: Что Альтман обнаружил и где использовал метод, благодоря которому обнаружил это? Ответ: Альтман обнаружил нейрогенез взрослых, благодоря тому, что использовал методику на взрослом мозге."},
              {"role": "user", "content": content}]
    
    return generate_response(messages)


def create_summary(long_text):
    """Creates a short summary of a long piece of text."""
    messages = [
        {"role": "system", "content": "You are a summarizer AI. Your summaries should be shorter than original texts and should contain all essential information. Please summarize the following text:"},
        {"role": "user", "content": """A neural network (NN), in the case of artificial neurons called artificial neural network (ANN) or simulated neural network (SNN), is an interconnected group of natural or artificial neurons that uses a mathematical or computational model for information processing based on a connectionistic approach to computation. In most cases, an ANN is an adaptive system that changes its structure based on external or internal information that flows through the network.
                                        In more practical terms neural networks are non-linear statistical data modeling or decision making tools. They can be used to model complex relationships between inputs and outputs or to find patterns in data.
                                        An artificial neural network involves a network of simple processing elements (artificial neurons) which can exhibit complex global behavior, determined by the connections between the processing elements and element parameters. Artificial neurons were first proposed in 1943 by Warren McCulloch, a neurophysiologist, and Walter Pitts, a logician, who first collaborated at the University of Chicago.[35]
                                        One classical type of artificial neural network is the recurrent Hopfield network.
                                        The concept of a neural network appears to have first been proposed by Alan Turing in his 1948 paper Intelligent Machinery in which he called them "B-type unorganised machines".[36]
                                        The utility of artificial neural network models lies in the fact that they can be used to infer a function from observations and also to use it. Unsupervised neural networks can also be used to learn representations of the input that capture the salient characteristics of the input distribution, e.g., see the Boltzmann machine (1983), and more recently, deep learning algorithms, which can implicitly learn the distribution function of the observed data. Learning in neural networks is particularly useful in applications where the complexity of the data or task makes the design of such functions by hand impractical."""},
        {"role": "assistant", "content": """A neural network, whether natural or artificial, is a group of interconnected neurons that processes information using a connectionistic approach. Artificial Neural Networks (ANNs) are mathematical models that can adapt their structure based on incoming data. They serve as non-linear statistical tools for data modeling and decision-making, allowing the modeling of complex relationships and pattern recognition.
                                            Artificial neural networks consist of simple processing elements (artificial neurons) with complex global behavior determined by their connections and parameters. They were first proposed in 1943 by Warren McCulloch and Walter Pitts. One classical type is the recurrent Hopfield network.
                                            The concept of neural networks was initially introduced by Alan Turing in 1948, referred to as "B-type unorganized machines."
                                            The utility of artificial neural networks lies in their ability to infer and use functions from observations. Unsupervised neural networks can learn representations of input data, making them valuable in complex tasks where manual function design is impractical. This includes deep learning algorithms that implicitly learn data distribution functions."""},
        {"role": "user", "content": long_text}
    ]

    return generate_response(messages)

def generate_response(messages):
    """Generate a response using the ChatGPT API."""
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
