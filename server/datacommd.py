import json  
import os  
def write_data(data, filename):
    filename="data/"+filename+".json"  
    """  
    将数据（字典格式）写入JSON文件。  
    :param data: 要写入的数据（字典格式）  
    :param filename: 文件名（包括路径和扩展名）  
    """  
    # 确保文件路径存在  
    directory = os.path.dirname(filename)  
    if not os.path.exists(directory):  
        os.makedirs(directory)  
    # 将数据写入JSON文件  
    with open(filename, 'w', encoding='utf-8') as file:  
        json.dump(data, file, ensure_ascii=False, indent=4)  
    print(f"数据已成功写入文件: {filename}")
def read_data(filename):  
    filename="data/"+filename+".json"
    """  
    从JSON文件中读取数据（返回字典格式）。  
    :param filename: 文件名（包括路径和扩展名）  
    :return: 从文件中读取的数据（字典格式）  
    """  
    try:  
        # 从JSON文件中读取数据  
        with open(filename, 'r', encoding='utf-8') as file:  
            data = json.load(file)  
        return data  
    except FileNotFoundError:  
        print(f"文件未找到: {filename}")  
        return None