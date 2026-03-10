#include <iostream>
#include <vector>
#include <string>

class person
{
private:
    int age;
    std::string gender;

public:
    person(int a,std::string b): age(a),gender(b) {}
    int getage(){
        return age;
    }
    std::string getgender(){
        return gender;
    }

};

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

int* singleton::level=new int;

int main(void)
{
    person Mike(13,"Male");
    std::cout << Mike.getage() << Mike.getgender() << std::endl;

    singleton::GetOne().Claim();
    singleton::GetOne().SetLevel(1);
    singleton::GetOne().AddLevel();
    singleton::GetOne().Log();

    return 0;
}