// 类的基本用法，const 修饰类内方法

// 单例的创建（static 用法）

// 重载运算符

#include <iostream>
#include <vector>
#include <string>

// 类，const
class person
{
private:
    mutable int age; // mutable 使变量能在 const 限制下仍改变
    std::string gender;

public:
    // 用重载函数初始化，应对多种情况
    person(): age(-1), gender("Unknown") {} // 默认构造函数
    person(int a,std::string b): age(a), gender(b) {} // 传参构造函数

    // 前面的 const 限制使用者利用 ref 特性修改返回值，从而影响私有变量

    // 后面的 const 规定方法内变量不能被修改，
    // 并将返回值的 this 指针变为 const 类型，使得 main 函数里的 const 对象可以调用方法
    const int& getage() const{
        return age;
    }
    const std::string& getgender() const{
        return gender;
    }
    
    const int& growup(int& year) const
    {
        age += year;
        return age;
    }
};

// 重载运算符 (极大简化代码操作)
std::ostream& operator<<(std::ostream& s, const person& sb)
{
    s << sb.getage() << ", " << sb.getgender() << std::endl;
    return s;
}
bool operator==(const person& a, const person& b)
{
    return (a.getage()==b.getage() && a.getgender()==b.getgender());
}

// 单例
class singleton
{
private:
    static int* level;
public:
    static singleton& GetOne()
    {
        static singleton TheOne;
        return TheOne;
    }
    class autodelete
    {
    public:
        ~autodelete(){
            if(singleton::level != nullptr){
                delete singleton::level;
                singleton::level = nullptr;
            }
        };
    };
    static autodelete deleter;
    

    void Claim()
    {
        std::cout << "put data" << std::endl;
    }
    void SetLevel(int num)
    {
        *level=((num>0 && num<=3)?num:-1);
    }
    void AddLevel(){(*level)++;}
    void RedLevel(){(*level)--;}
    void Log()
    {
        switch (*level)
        {
            case 1: { std::cout << "Low" << "\n";break;}
            case 2: {std::cout << "Medium" << "\n";break;}
            case 3: {std::cout << "High" << "\n";break;}
            default: {std::cout << "Error" << "\n";break;}
        }
    }
};

int* singleton::level=new int; // 静态变量必须在类外初始化


int main(void)
{
    const person Mike(13,"Male"); // const 对象在调用方法时，只能用 const 修饰过的方法
    int year_pass = 5;

    std::cout << Mike; // 调用重载运算符
    std::cout << Mike.growup(year_pass) <<", "<< Mike.getgender() << std::endl;

    singleton::GetOne().Claim();
    singleton::GetOne().SetLevel(1);
    singleton::GetOne().AddLevel();
    singleton::GetOne().Log();

    std::cin.get();
    
    return 0;
}