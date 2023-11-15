from lcapy import Circuit
from lcapy import s

cct = Circuit("""
VACSource_3-3_2-3 0 1 {5* sin(3*t)}
L_2-3_2-4 1 2 1 5
W_2-4_3-4 2 3
W_3-3_3-4 0 3""")
print(cct[1].V(s))
