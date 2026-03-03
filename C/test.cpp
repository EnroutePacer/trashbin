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

int main(void)
{
    person Mike(13,"Male");
    std::cout << Mike.getage() << Mike.getgender() << std::endl;
    return 0;
}