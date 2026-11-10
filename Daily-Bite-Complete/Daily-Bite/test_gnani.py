from dotenv import load_dotenv
from gnani.stt import GnaniSTTClient
from gnani.tts import GnaniTTSClient, AudioConfig

load_dotenv()

try:
    # Test Timbre: Text-to-Speech
    print("Testing Timbre TTS...")

    tts = GnaniTTSClient()

    audio = tts.synthesize(
        "Hello! Welcome to DailyBite. Let's plan your meals.",
        voice="Kaveri",
        model="timbre-v2.5",
        language="en-IN",
        audio_config=AudioConfig(
            container="mp3",
            sample_rate=48000,
            bitrate="128k"
        )
    )

    with open("test_voice.mp3", "wb") as file:
        file.write(audio)

    print("TTS successful! Audio saved as test_voice.mp3")

    # Test Prisma: Speech-to-Text
    print("\nTesting Prisma STT...")

    stt = GnaniSTTClient()

    result = stt.transcribe(
        "test_voice.mp3",
        language_code="en-IN",
        model="prisma-v3.0"
    )

    print("STT successful!")
    print("Transcription:", result["transcript"])

except Exception as error:
    print("Gnani API test failed:")
    print(type(error).__name__, error)