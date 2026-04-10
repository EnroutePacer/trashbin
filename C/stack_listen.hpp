#include <iostream>

class Listener
{
private:
    static int on_going;
    int ID;
public:
    Listener(): ID(++on_going) {
        std::cout << std::endl << "start: " << this->ID << "\n" << std::endl;
    }

    ~Listener(){
        std::cout << this->ID << ": closed" << std::endl;
    }

    int getID(){
        return this->ID;
    }
};
