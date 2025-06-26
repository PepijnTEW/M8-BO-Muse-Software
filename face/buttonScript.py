#!/usr/bin/env python3
import os
import serial
import subprocess
import time

# ← adjust this if your Uno shows up differently
SERIAL_PORT = "/dev/ttyACM0"
BAUD_RATE   = 9600

# wait a moment for the port (and Wayland) to be ready
time.sleep(2)

# open the serial port
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
except serial.SerialException as e:
    print(f"[!] Could not open {SERIAL_PORT}: {e}")
    exit(1)

print(f"[+] Listening on {SERIAL_PORT} at {BAUD_RATE} baud")

while True:
    line = ser.readline().decode("ascii", errors="ignore").strip()
    if line == "START":
        # send the “a” key via wtype (Wayland-native)
        subprocess.run(["wtype", "a"])
        print("→ Sent key: a")
