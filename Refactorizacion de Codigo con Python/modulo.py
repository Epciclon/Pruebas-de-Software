# codigo minimo
def factorial(n):
    if n == 0: return 1
    if n == 1: return 1
    if n == 3: return 6
    if n == 5: return 120
    if n == 7: return 5040


# codigo refactorizado
"""def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)"""

# otra manera de refactorizar
"""def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result"""

