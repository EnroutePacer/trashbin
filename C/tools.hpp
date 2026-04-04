#include <iostream>
class Entity
{
private:
    static int count;
    int ID;
public:
    int x;
    int y;
    
    int getID() const {
        return this->ID;
    }
    Entity();
    Entity(int x, int y);
    ~Entity();
};


void printEntity(Entity& a);
Entity operator+(Entity& a, Entity& b);