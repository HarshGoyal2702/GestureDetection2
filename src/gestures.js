export const estimateGesture = (landmarks) => {
    if (!landmarks || landmarks.length < 21) return { gesture: "No Gesture Detected", raisedFingers: [] };
    let extendedFingers = 0
    const isFingerUp = (tip, base) => tip[1] < base[1];
    let fingertips = [];

    // Finger landmark indices based on the handpose model
    const fingerTipsIndices = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky

    fingerTipsIndices.forEach((tipIdx, i) => {
        if (landmarks[tipIdx][1] < landmarks[tipIdx - 2][1]) {
            extendedFingers++;
            fingertips.push({ x: landmarks[tipIdx][0], y: landmarks[tipIdx][1] });
        }
    });

    const fingers = {
        thumb: landmarks[4][0] > landmarks[2][0], // Thumb moves sideways
        index: isFingerUp(landmarks[8], landmarks[5]),
        middle: isFingerUp(landmarks[12], landmarks[9]),
        ring: isFingerUp(landmarks[16], landmarks[13]),
        pinky: isFingerUp(landmarks[20], landmarks[17]),
    };

    // Identify which fingers are raised
    const raisedFingers = Object.keys(fingers).filter(finger => fingers[finger]);

    // Gesture map based on finger states
    const gestures = {
        "01000": "one",
        "01100": "two",
        "01110": "three",
        "01111": "four",
        "11111": "five",
        "00000": "no fingers",
        "10000": "thumbsUp",
    };

    const palmPoints = [landmarks[0], landmarks[5], landmarks[9], landmarks[13], landmarks[17]];

    // Compute Palm Center (Average X & Y)
    const palmCenter = palmPoints.reduce(
        (acc, point) => ({ x: acc.x + point[0], y: acc.y + point[1] }),
        { x: 0, y: 0 }
    );

    palmCenter.x /= palmPoints.length;
    palmCenter.y /= palmPoints.length;

    const key = Object.values(fingers).map((b) => (b ? "1" : "0")).join("");
    const gesture = gestures[key] || "No Gesture Detected";

    return { gesture, fingertips ,palmCenter};
};
