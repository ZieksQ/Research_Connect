



def add_fudge(func):
    def wrapper(*args, **kwargs):
        print("You have added fudge")
        print()
        result = func(*args, **kwargs)
        print("you have finshed adding fudge")
        print()
        return result
    return wrapper

def add_sprinkle(func):
    def wrapper(*args, **kwargs):
        print("You have added sprinkles")
        print()
        result = func(*args, **kwargs)
        print("you have finshed adding sprinkles")
        print()
        return result
    return wrapper


@add_sprinkle
@add_fudge
def get_icecream(flavor):
    return f"You got {flavor} ice cream"


print(get_icecream("vanila"))