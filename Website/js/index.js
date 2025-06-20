let currentLang = "nl";

function switchLanguage() {
  if (currentLang === "nl") {
    document.getElementById("title").innerText = "MUSE - EMOTION ROBOT";
    document.getElementById("watIsMuseTitel").innerText = "What is Muse";
    document.getElementById("watIsMuseTekst").innerText = "MUSE is an innovative art project developed by second-year students from MediaCollege Amsterdam. Commissioned by the Amsterdam Museum, we created an interactive artwork focused on emotion and technology. The EmotieRobot uses facial recognition to detect your emotion and plays a personalized video to brighten your day.";
    document.getElementById("mediaTitel").innerText = "MEDIA SECTION";
    document.getElementById("hoeWerktTitel").innerText = "How does it work?";
    document.getElementById("stap1").innerHTML = "<strong>Step 1:</strong> Stand calmly in front of the robot. It detects your presence.";
    document.getElementById("stap2").innerHTML = "<strong>Step 2:</strong> MUSE analyzes your facial expression (e.g., happy, sad, angry).";
    document.getElementById("stap3").innerHTML = "<strong>Step 3:</strong> Based on your emotion, a video is shown to surprise and uplift you.";
    document.getElementById("overOnsTitel").innerText = "About us";
    document.getElementById("overOnsTekst").innerText = "We are all second-year students at the Media College Amsterdam...";
    currentLang = "en";
  } else {
    document.getElementById("title").innerText = "MUSE - EMOTIE ROBOT";
    document.getElementById("watIsMuseTitel").innerText = "Wat is Muse";
    document.getElementById("watIsMuseTekst").innerText = "MUSE is een innovatief kunstproject ontwikkeld door tweedejaarsstudenten van het MediaCollege Amsterdam. In opdracht van het Amsterdam Museum zijn wij als studenten aan de slag gegaan met het creëren van een interactief kunstwerk dat inspeelt op emotie en technologie. Deze robot maakt gebruik van gezichtsherkenning om jouw emotie te analyseren en speelt een persoonlijke video af.";
    document.getElementById("mediaTitel").innerText = "HIER KOMT DE MEDIA";
    document.getElementById("hoeWerktTitel").innerText = "Hoe werkt het?";
    document.getElementById("stap1").innerHTML = "<strong>Stap 1:</strong> Ga rustig voor de robot staan. De installatie detecteert automatisch jouw aanwezigheid.";
    document.getElementById("stap2").innerHTML = "<strong>Stap 2:</strong> MUSE voert een gezichtsanalyse uit. Je gezichtsuitdrukking (zoals blij, verdrietig of boos) wordt herkend.";
    document.getElementById("stap3").innerHTML = "<strong>Stap 3:</strong> Op basis van jouw emotie toont MUSE een unieke video, speciaal afgestemd om je humeur te beïnvloeden en je te verrassen.";
    document.getElementById("overOnsTitel").innerText = "Over ons";
    document.getElementById("overOnsTekst").innerText = "Wij zijn allemaal 2e jaar studenten aan het Media College Amsterdam...";
    currentLang = "nl";
  }
}

  function toggleBox(element) {
    // Alleen op mobiel actief
    if (window.innerWidth <= 970) {
      element.classList.toggle("active");
    }
  }

