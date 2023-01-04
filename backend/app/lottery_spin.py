import random


def lottery(dr1 = 2, dr2 = 5, dr3 = 10) -> int:
    """
    Spin the lottery and output the prize.

    Args:
        dr1 (int, optional): drop rate of tier 1. Defaults to 2.
        dr2 (int, optional): drop rate of tier 2. Defaults to 5.
        dr3 (int, optional): drop rate of tier 3. Defaults to 10.

    Returns:
        int: the tier of the prize
    """
    num = random.random()
    num *= 100

    if num < dr1:
        return 1
    elif num < (dr1 + dr2):
        return 2
    elif num < (dr1 + dr2 + dr3):
        return 3
    else:
        return 4


# testing
while True:
    ans = lottery(10, 20, 30)
    print(ans)
    if ans == 1:
        break