// Aims to listen function calls in stack 
// Using threads to control

#include "stack_listen.hpp"
#include <thread>

static bool is_pause = false;
static bool is_end = false;

int Listener::on_going = 0;

int fib(int n){ using namespace std::literals::chrono_literals;

    Listener a;

    std::this_thread::sleep_for(std::chrono::seconds(1));

    if(is_pause){
        std::cout << "\nCurrent: " << n << "\n";
        while(is_pause){
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    }

    if(n == 1) return 1;
    if(n == 2) return 2;
    return fib(n-1) + fib(n-2);
}

void pause_check(){
    while(!is_end){
        std::cin.get();
        is_pause = !is_pause;
    }
    return;
}

int main()
{
    int n;
    std::cin >> n;std::cin.get();
    std::thread recursive(fib, n);
    std::thread action(pause_check);

    recursive.join();
    is_end = true;

    action.join();
    return 0;
}