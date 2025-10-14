# test_factorial.py
import unittest
#from modulo import factorial  

class TestFactorial(unittest.TestCase):
    def test_factorial_0(self):
        self.assertEqual(factorial(0), 1)

    def test_factorial_1(self):
        self.assertEqual(factorial(1), 1)

    def test_factorial_3(self):
        self.assertEqual(factorial(3), 6)

    def test_factorial_5(self):
        self.assertEqual(factorial(5), 120)

    def test_factorial_7(self):
        self.assertEqual(factorial(7), 5040)

    """def test_factorial_8(self):
        self.assertEqual(factorial(8), 40320)"""

if __name__ == "__main__":
    unittest.main()

