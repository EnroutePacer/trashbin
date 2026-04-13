#include <iostream>
#include <vector>

class Entity
{
protected:
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
    virtual ~Entity();
};

class MagnetEntity : public Entity
{
public:
    int range;

    MagnetEntity();
    MagnetEntity(int x, int y, int range);
    ~MagnetEntity();
};




void printEntity(Entity& a);
Entity operator+(Entity& a, Entity& b);

void ActivateMagnet(std::vector<Entity*>& v);
