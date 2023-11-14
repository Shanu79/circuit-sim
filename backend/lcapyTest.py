from lcapy import Circuit

netlist = "V_2-3_1-3 0 1 6\nR_1-3_1-4 1 2 2\nR_1-4_2-4 2 3 2\nR_2-4_2-3 3 0 2\n"

a = Circuit(netlist)



print(-a[2].v)
print(a.I(1))

