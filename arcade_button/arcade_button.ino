const int buttonPin = 2;
const int redPin    = 9;
const int greenPin  = 10;
const int bluePin   = 11;

bool lastButtonState = HIGH;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(redPin,    OUTPUT);
  pinMode(greenPin,  OUTPUT);
  pinMode(bluePin,   OUTPUT);

  Serial.begin(9600);
  clearLED();
}

void loop() {
  bool currentButtonState = digitalRead(buttonPin);

  // on falling edge (button press)
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    Serial.println("START");    // trigger your Python / Pi listener

    // flash green briefly
    setLEDColor(0, 255, 0);
    delay(200);
    clearLED();
  }

  lastButtonState = currentButtonState;
}

// helper to set RGB LED
void setLEDColor(int r, int g, int b) {
  analogWrite(redPin,   r);
  analogWrite(greenPin, g);
  analogWrite(bluePin,  b);
}

void clearLED() {
  analogWrite(redPin,   0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin,  0);
}
