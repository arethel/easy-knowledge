def divide_text_into_blocks(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
            blocks = text.split('\n\n')
            return blocks
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []
