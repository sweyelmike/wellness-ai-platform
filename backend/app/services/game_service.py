async def check_badges(points: int, current_badges: list):
    new_badges = []
    if points >= 50 and "Beginner" not in current_badges:
        new_badges.append("Beginner")
    if points >= 100 and "Health Warrior" not in current_badges:
        new_badges.append("Health Warrior")
    if points >= 500 and "Wellness Guru" not in current_badges:
        new_badges.append("Wellness Guru")
    return new_badges