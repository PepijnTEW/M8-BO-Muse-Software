
const int buttonPin = 2;
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

bool lastButtonState = HIGH;
bool countdownActive = false;
unsigned long countdownStart = 0;
const int countdownTime = 5; // seconden

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  Serial.begin(9600);
  clearLED();
}

void loop() {
  bool currentButtonState = digitalRead(buttonPin);

  // Start countdown bij knopdruk
  if (!countdownActive && lastButtonState == HIGH && currentButtonState == LOW) {
    Serial.println("START"); // Stuur signaal naar Python
    countdownStart = millis();
    countdownActive = true;
  }

  lastButtonState = currentButtonState;

  // Countdown loopt
  if (countdownActive) {
    int secondsLeft = countdownTime - ((millis() - countdownStart) / 1000);

    if (secondsLeft >= 0) {
      updateLED(secondsLeft);
    } else {
      clearLED();
      countdownActive = false;
    }
  }
}

void updateLED(int secondsLeft) {
  switch (secondsLeft) {
    case 5:
    case 4:
    case 3:
    case 2:
    case 1:
      setLEDColor(255, 0, 0); // rood
      break;
    case 0:
      setLEDColor(0, 255, 0); // groen
      break;
  }
}

void setLEDColor(int r, int g, int b) {
  analogWrite(redPin, r);
  analogWrite(greenPin, g);
  analogWrite(bluePin, b);
}

void clearLED() {
  analogWrite(redPin, 0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);
}
