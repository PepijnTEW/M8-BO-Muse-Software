#!/usr/bin/env python3
import serial
import subprocess
import time

# ← adjust this if your Uno shows up differently
SERIAL_PORT = "/dev/ttyACM0"
BAUD_RATE   = 9600

time.sleep(2)  # wait for the port to settle
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
print(f"[+] Listening on {SERIAL_PORT} at {BAUD_RATE} baud")

while True:
    line = ser.readline().decode("ascii", errors="ignore").strip()
    if line == "START":
        # send the “a” key (or whichever key your JS listens for)
        subprocess.run(["xdotool", "key", "a"])
        print("→ Sent key: a")
