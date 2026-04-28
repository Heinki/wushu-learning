const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'src', 'assets', 'data', 'en');
const targetRoot = path.join(root, 'src', 'assets', 'data', 'de');

const categories = new Map([
  ['Balance Techniques', 'Gleichgewichtstechniken'],
  ['Hand Forms/ Shapes', 'Handformen'],
  ['Leg Techniques', 'Beintechniken'],
  ['Stances', 'Stände'],
  ['Jumps', 'Sprünge'],
  ['Weapon Techniques', 'Waffentechniken'],
]);

const techniqueNames = new Map([
  ['Bǎi Lián Pāi Jiǎo (Lotus Slap Kick)', 'Bǎi Lián Pāi Jiǎo (Lotus-Schlagtritt)'],
  ['Bán Jiao Chào Tian Zhi Li (Grasp the foot and bring it to head level with the leg held vertically while remaining standing)', 'Bán Jiao Chào Tian Zhi Li (Fuß greifen und bei senkrecht gehaltenem Bein auf Kopfhöhe bringen, während man steht)'],
  ['Cè Kōng Fān (Aerial Cartwheel)', 'Cè Kōng Fān (Rad ohne Handstütz)'],
  ['Cè Kōng Fān Zhuǎn Tǐ (Aerial Cartwheel Twist)', 'Cè Kōng Fān Zhuǎn Tǐ (Rad ohne Handstütz mit Drehung)'],
  ['Cé Shèn Píng Héng (Sideways Leaning Balance)', 'Cé Shèn Píng Héng (seitlich geneigtes Gleichgewicht)'],
  ['Cé Ti Bảo Jiáo Zhi Li (Side kick up to catch the foot at head level with the leg held vertically while remaining standing)', 'Cé Ti Bảo Jiáo Zhi Li (Seittritt nach oben, Fuß auf Kopfhöhe fangen, Bein senkrecht halten und stehen bleiben)'],
  ['Cé Ti Bảo Jiáo Zhi Li (Side kick up to catch the foot at head level)', 'Cé Ti Bảo Jiáo Zhi Li (Seittritt nach oben, Fuß auf Kopfhöhe fangen)'],
  ['Cè Ti Tuí (Side Stretch Kick)', 'Cè Ti Tuí (seitlicher Strecktritt)'],
  ['Chán Tóu (Broadsword Twining)', 'Chán Tóu (Umwickeln mit dem Säbel)'],
  ['Chuài Tuí (Side Kick)', 'Chuài Tuí (Seittritt)'],
  ['Dān Pāi Jiǎo (Front Slap Kick)', 'Dān Pāi Jiǎo (vorderer Schlagtritt)'],
  ['Dēng Tuí (Heel Push Kick)', 'Dēng Tuí (Fersenschubtritt)'],
  ['Die Shù Chà (Falling Front Split)', 'Die Shù Chà (fallender Frontspagat)'],
  ['Gōng Bù (Bow Stance)', 'Gōng Bù (Bogenstand)'],
  ['Gōu Shiòu (Hook)', 'Gōu Shiòu (Hakenhand)'],
  ['Guà Jiàn (Straight Sword Hooking Parry)', 'Guà Jiàn (hakende Parade mit dem geraden Schwert)'],
  ['Guǒ Nǎo (Wrapping with the Broadsword)', 'Guǒ Nǎo (Wickeln mit dem Säbel)'],
  ['Hou Sao Tui (Back Sweep)', 'Hou Sao Tui (Rückwärtsschwung)'],
  ['Jiàn Zhi (Sword Fingers)', 'Jiàn Zhi (Schwertfinger)'],
  ['Kòu Tuì Píng Héng (Rear Cross-legged Balance)', 'Kòu Tuì Píng Héng (Gleichgewicht mit hinten gekreuztem Bein)'],
  ['Lán Qiāng (Outward Blocking)', 'Lán Qiāng (Block nach außen)'],
  ['Lǐ Hé Pāi Jiǎo (Inward Slap Kick)', 'Lǐ Hé Pāi Jiǎo (einwärts geführter Schlagtritt)'],
  ['Lì Wǔ Huā Gùn (Vertical Figure 8 with the Cudgel)', 'Lì Wǔ Huā Gùn (vertikale Acht mit dem Stock)'],
  ['Lì Wǔ Huā Qiāng (Vertical Figure 8 with the Spear)', 'Lì Wǔ Huā Qiāng (vertikale Acht mit dem Speer)'],
  ['Liāo Jiàn (Straight Sword Uppercut)', 'Liāo Jiàn (Aufwärtsschlag mit dem geraden Schwert)'],
  ['Mǎ Bù (Horse Stance)', 'Mǎ Bù (Pferdestand)'],
  ['Ná Qiāng (Inward Blocking with the Spear)', 'Ná Qiāng (Block nach innen mit dem Speer)'],
  ['Pán Tuì Píng Héng (Front Cross Legged Balance)', 'Pán Tuì Píng Héng (Gleichgewicht mit vorn gekreuztem Bein)'],
  ['Píng Lūn Gùn (Horizontal Cudgel Windmill Waving with One Hand)', 'Píng Lūn Gùn (horizontales Windmühlen-Schwingen des Stocks mit einer Hand)'],
  ['Pū Bù (Crouching Stance)', 'Pū Bù (Kauerstand)'],
  ['Qì Xiè Pāo Jiē (Weapon Throwing and Catching Techniques)', 'Qì Xiè Pāo Jiē (Waffe werfen und fangen)'],
  ['Qian Sao Tui (Front Sweep)', 'Qian Sao Tui (Vorwärtsschwung)'],
  ['Quán (Fist)', 'Quán (Faust)'],
  ['Shi Zi Píng Héng (Forward Leaning Balance with Arms Outspread)', 'Shi Zi Píng Héng (nach vorn geneigtes Gleichgewicht mit ausgebreiteten Armen)'],
  ['Shuāng Shǒu Tí Liāo Huā Gùn (Vertical Uppercutting Cudgel with Both Hands)', 'Shuāng Shǒu Tí Liāo Huā Gùn (vertikaler Aufwärtsschwung des Stocks mit beiden Händen)'],
  ['Tân Hải Píng Héng (Exploring the Ocean Balance)', 'Tân Hải Píng Héng (Meer-erkundendes Gleichgewicht)'],
  ['Tán Tuí (Snap/Spring Kick)', 'Tán Tuí (Schnapptritt)'],
  ['Téng Kōng Bǎi Lián (Jumping Lotus Kick)', 'Téng Kōng Bǎi Lián (gesprungener Lotus-Schlagtritt)'],
  ['Téng Kōng Dēng Tuǐ (Jumping Heel Push Kick)', 'Téng Kōng Dēng Tuǐ (gesprungener Fersenschubtritt)'],
  ['Téng Kōng Fēi Jiǎo (Jumping Front Slap Kick)', 'Téng Kōng Fēi Jiǎo (gesprungener vorderer Schlagtritt)'],
  ['Téng Kōng Jiàn Tàn (Jumping Snap/Spring Kick)', 'Téng Kōng Jiàn Tàn (gesprungener Schnapptritt)'],
  ['Téng Kōng Shuāng Fēi Jiǎo (Jumping Double Front Slap Kick)', 'Téng Kōng Shuāng Fēi Jiǎo (gesprungener doppelter vorderer Schlagtritt)'],
  ['Téng Kōng Xié Fēi Jiǎo (Jumping Slant Kick)', 'Téng Kōng Xié Fēi Jiǎo (gesprungener schräger Tritt)'],
  ['Téng Kōng Zhèng Tī Tuǐ (Jumping Front Straight Kick)', 'Téng Kōng Zhèng Tī Tuǐ (gesprungener gerader Vorwärtstritt)'],
  ['Ti Xi Dú Li (Single Knee Raised Position)', 'Ti Xi Dú Li (einbeiniges Stehen mit angehobenem Knie)'],
  ['Wàng Yuè Píng Héng (Gazing at the Moon Balance)', 'Wàng Yuè Píng Héng (Mondbetrachtungs-Gleichgewicht)'],
  ['Wò Jiàn (Gripping the Straight Sword)', 'Wò Jiàn (Griff des geraden Schwerts)'],
  ['Xiē Bù (Cross-Legged Crouching Stance)', 'Xiē Bù (gekreuzter Kauerstand)'],
  ['Xū Bù (Empty Stance)', 'Xū Bù (Leerstand)'],
  ['Xuàn Fēng Jiǎo (Tornado Kick)', 'Xuàn Fēng Jiǎo (Wirbelwindtritt)'],
  ['Xuàn Zǐ (Butterfly Kick)', 'Xuàn Zǐ (Schmetterlingstritt)'],
  ['Xuàn Zǐ Zhuǎn Tǐ (Butterfly Twist)', 'Xuàn Zǐ Zhuǎn Tǐ (Schmetterlingsdrehung)'],
  ['Yáng Shèn Píng Héng (Backward Leaning Balance)', 'Yáng Shèn Píng Héng (rückwärts geneigtes Gleichgewicht)'],
  ['Zhā Qiāng (Spear Thrust)', 'Zhā Qiāng (Speerstoß)'],
  ['Zhàng (Palm)', 'Zhàng (Handfläche)'],
  ['Zhèng Ti Tuí (Front Stretch Kick)', 'Zhèng Ti Tuí (gerader Vorwärts-Strecktritt)'],
  ['Zuò Pán (Cross-Legged Sitting)', 'Zuò Pán (Sitz mit gekreuzten Beinen)'],
]);

const phrases = new Map([
  ['Angle of the torso is 45 degrees or more above horizontal level during the twist', 'Der Oberkörper ist während der Drehung 45 Grad oder mehr über der Horizontalen'],
  ['Any finger wraps around the top of the hand guard and touches the edge of the blade', 'Ein Finger greift oben um den Handschutz und berührt die Klingenkante'],
  ['Any portion of the sole of the rear leg is obviously off the floor', 'Ein Teil der Sohle des hinteren Beins ist deutlich vom Boden abgehoben'],
  ['Because one leg is crossed in front of the supporting leg while maintaining balance on the supporting leg.', 'Weil ein Bein vor dem Standbein gekreuzt wird, während das Gleichgewicht auf dem Standbein gehalten wird.'],
  ['Because the body leans backward while maintaining balance with one leg raised forward.', 'Weil der Körper nach hinten geneigt ist, während mit einem nach vorn angehobenen Bein das Gleichgewicht gehalten wird.'],
  ['Both the supporting leg and the raised leg should be completely straight, with no bending at the knees.', 'Sowohl das Standbein als auch das angehobene Bein sollen vollständig gestreckt sein, ohne Beugung in den Knien.'],
  ['Either one of the feet is not in contact with the floor', 'Einer der Füße hat keinen Bodenkontakt'],
  ["Extended leg's foot is not turned inwards with the sole completely flat on the ground", 'Der Fuß des gestreckten Beins ist nicht nach innen gedreht und die Sohle liegt nicht vollständig flach auf dem Boden'],
  ['Face of fist uneven', 'Faustfläche ist uneben'],
  ['Face of fist is uneven', 'Faustfläche ist uneben'],
  ['Failure to catch the straight sword or broadsword by the handle, or the cudgel or spear shaft with a single hand', 'Das gerade Schwert oder der Säbel wird nicht am Griff gefangen, oder Stock beziehungsweise Speerschaft werden nicht mit einer Hand gefangen'],
  ['Four fingers not straight and held together', 'Vier Finger sind nicht gerade und geschlossen gehalten'],
  ['Four fingers are not straight and held together', 'Vier Finger sind nicht gerade und geschlossen gehalten'],
  ['Front and rear legs did not form two parallel straight line', 'Vorderes und hinteres Bein bilden keine zwei parallelen geraden Linien'],
  ['Front and rear legs do not form two parallel straight lines', 'Vorderes und hinteres Bein bilden keine zwei parallelen geraden Linien'],
  ['Heel of supporting leg off the floor', 'Ferse des Standbeins ist vom Boden abgehoben'],
  ['Heel of supporting leg is off the floor', 'Ferse des Standbeins ist vom Boden abgehoben'],
  ['Heel or heels raised off the ground', 'Eine oder beide Fersen sind vom Boden abgehoben'],
  ['Index finger and middle finger not kept straight and together', 'Zeige- und Mittelfinger sind nicht gerade und zusammen gehalten'],
  ['Index finger and middle finger are not kept straight and together', 'Zeige- und Mittelfinger sind nicht gerade und zusammen gehalten'],
  ['Instep of the raised bent leg not extended flat', 'Der Spann des angehobenen gebeugten Beins ist nicht flach gestreckt'],
  ['Knee or knees buckling inwards', 'Ein Knie oder beide Knie knicken nach innen ein'],
  ['Knee/s bent at the apex of the kick', 'Ein Knie oder beide Knie sind am höchsten Punkt des Tritts gebeugt'],
  ['Knee/s are bent at the apex of the kick', 'Ein Knie oder beide Knie sind am höchsten Punkt des Tritts gebeugt'],
  ['Leg or legs bent 45 degrees or more while in the air', 'Ein Bein oder beide Beine sind in der Luft um 45 Grad oder mehr gebeugt'],
  ['Leg or legs obviously bent 45 degrees or more while in the air', 'Ein Bein oder beide Beine sind in der Luft deutlich um 45 Grad oder mehr gebeugt'],
  ['Neither one of the buttocks is in contact with the floor', 'Keine Gesäßhälfte berührt den Boden'],
  ['No obvious horizontal circle formed', 'Es wird kein klar erkennbarer horizontaler Kreis gebildet'],
  ['No obvious vertical circle formed', 'Es wird kein klar erkennbarer vertikaler Kreis gebildet'],
  ['One leg is the supporting leg with the thigh at horizontal level, while the other leg is crossed in front of it.', 'Ein Bein ist das Standbein mit dem Oberschenkel auf horizontaler Höhe, während das andere Bein davor gekreuzt wird.'],
  ['Pushing leg does not transit from an obvious bend of 45 degrees or more to completely straight', 'Das schiebende Bein geht nicht aus einer deutlichen Beugung von 45 Grad oder mehr in eine vollständig gestreckte Position über'],
  ['Pushing leg is below horizontal level', 'Das schiebende Bein ist unter horizontaler Höhe'],
  ["Raised foot's toes not pointed and hooking inwards", 'Die Zehen des angehobenen Fußes sind nicht gestreckt und nach innen gehakt'],
  ["Raised foot's toes are not pointed and hooking inwards", 'Die Zehen des angehobenen Fußes sind nicht gestreckt und nach innen gehakt'],
  ['Raised knee not above waist level', 'Angehobenes Knie ist nicht über Hüfthöhe'],
  ['Raised leg bent', 'Angehobenes Bein ist gebeugt'],
  ['Raised leg is bent', 'Angehobenes Bein ist gebeugt'],
  ['Raised shank/calf of the leg is not turning obliquely inwards', 'Der angehobene Unterschenkel dreht nicht schräg nach innen'],
  ['Rear handle of spear end protrudes from the grip', 'Das hintere Ende des Speers ragt aus dem Griff heraus'],
  ['Slap missed and/or inaudible', 'Der Schlag wird verfehlt und/oder ist nicht hörbar'],
  ['Slap is missed and/or inaudible', 'Der Schlag wird verfehlt und/oder ist nicht hörbar'],
  ['Snap or spring leg does not transit from an obvious bend of 45 degrees or more to completely straight', 'Das Schnappbein geht nicht aus einer deutlichen Beugung von 45 Grad oder mehr in eine vollständig gestreckte Position über'],
  ['Snap or spring leg is below horizontal level', 'Das Schnappbein ist unter horizontaler Höhe'],
  ['Spear head not travelling in a clearly defined arc', 'Die Speerspitze bewegt sich nicht in einem klar definierten Bogen'],
  ['Straight sword and forearm or wrist are aligned', 'Gerades Schwert und Unterarm oder Handgelenk liegen auf einer Linie'],
  ['Supporting Leg Bent', 'Standbein gebeugt'],
  ['Supporting leg bent', 'Standbein gebeugt'],
  ['Supporting leg is bent', 'Standbein ist gebeugt'],
  ['Sweeping leg bent 45° or more', 'Schwungbein ist um 45° oder mehr gebeugt'],
  ['The angle between the torso and the hanging leg is less than 135 degrees at that moment', 'Der Winkel zwischen Oberkörper und hängendem Bein beträgt in diesem Moment weniger als 135 Grad'],
  ["The arms should be outspread to form a cross-like position (hence the name 'Shi Zi' which means cross).", "Die Arme sollen ausgebreitet sein und eine kreuzartige Position bilden, daher der Name 'Shi Zi', der Kreuz bedeutet."],
  ['The back of the broadsword blade is not kept close to the body when wrapping or twining', 'Der Rücken der Säbelklinge wird beim Wickeln oder Umwinden nicht nah am Körper geführt'],
  ['The back of the thigh of the squatting leg is not in contact with the calf', 'Die Rückseite des Oberschenkels des hockenden Beins hat keinen Kontakt zur Wade'],
  ['The buttocks are not in contact with the calf of the sitting leg', 'Das Gesäß hat keinen Kontakt zur Wade des sitzenden Beins'],
  ['The cudgel does not rotate in an obvious vertical plane', 'Der Stock rotiert nicht in einer deutlich erkennbaren vertikalen Ebene'],
  ["The distance between the inner portions of the two feet is narrower than the performer's shoulder width", 'Der Abstand zwischen den Innenseiten der beiden Füße ist kleiner als die Schulterbreite der ausführenden Person'],
  ['The extended leg is not completely straight', 'Das gestreckte Bein ist nicht vollständig gerade'],
  ['The five fingers are not pinched together', 'Die fünf Finger sind nicht zusammengefasst'],
  ['The five fingers should be pinched together, and the wrist should be completely hooked.', 'Die fünf Finger sollen zusammengefasst sein, und das Handgelenk soll vollständig gehakt sein.'],
  ["The four fingers should be straight and held together, while the thumb should be bent and held in tightly at the tiger's mouth area.", 'Die vier Finger sollen gerade und geschlossen gehalten werden, während der Daumen gebeugt und eng am Tigermaul-Bereich angelegt ist.'],
  ['The front and rear legs should form two parallel straight lines.', 'Vorderes und hinteres Bein sollen zwei parallele gerade Linien bilden.'],
  ['The hanging leg is bent when the toes of the kicking leg touch the forehead or above', 'Das hängende Bein ist gebeugt, wenn die Zehen des tretenden Beins die Stirn oder höher erreichen'],
  ['The heel of supporting foot is raised off the ground', 'Die Ferse des Standfußes ist vom Boden abgehoben'],
  ['The heel of the supporting leg must remain in contact with the floor throughout the technique.', 'Die Ferse des Standbeins muss während der gesamten Technik Bodenkontakt behalten.'],
  ['The heel of the supporting leg should remain on the floor throughout the kick.', 'Die Ferse des Standbeins soll während des gesamten Tritts auf dem Boden bleiben.'],
  ['The index finger and middle finger should be kept straight and together, while the thumb should be pressing on the ring finger and little finger.', 'Zeige- und Mittelfinger sollen gerade und zusammen gehalten werden, während der Daumen auf Ringfinger und kleinen Finger drückt.'],
  ['The instep of the raised bent leg should be extended flat with a clear inclination.', 'Der Spann des angehobenen gebeugten Beins soll flach gestreckt sein und eine klare Neigung zeigen.'],
  ['Instep of the raised bent leg is not extended flat', 'Der Spann des angehobenen gebeugten Beins ist nicht flach gestreckt'],
  ['The kicking leg does not transit from obvious bent (45° or more) to completely straight', 'Das Trittbein geht nicht aus einer deutlichen Beugung von 45° oder mehr in eine vollständig gestreckte Position über'],
  ['The kicking leg must be bent at least 45° or more before transitioning to completely straight.', 'Das Trittbein muss mindestens 45° oder mehr gebeugt sein, bevor es vollständig gestreckt wird.'],
  ['The kicking leg must bend at least 45° before transitioning to completely straight.', 'Das Trittbein muss mindestens 45° gebeugt sein, bevor es vollständig gestreckt wird.'],
  ['The kicking leg should transition from an obviously bent position (45° or more) to completely straight in a snapping motion.', 'Das Trittbein soll in einer Schnappbewegung aus einer deutlich gebeugten Position (45° oder mehr) in eine vollständig gestreckte Position übergehen.'],
  ['The knee of the front leg is not above the instep', 'Das Knie des vorderen Beins befindet sich nicht über dem Spann'],
  ['The leg should be completely straight at the apex of the kick with no bend in the knee.', 'Das Bein soll am höchsten Punkt des Tritts vollständig gestreckt sein, ohne Beugung im Knie.'],
  ["The raised foot's toes should be pointed and hooking inwards.", 'Die Zehen des angehobenen Fußes sollen gestreckt sein und nach innen haken.'],
  ['The raised leg is held below horizontal level', 'Das angehobene Bein wird unter horizontaler Höhe gehalten'],
  ['The raised leg should be held at or above horizontal level.', 'Das angehobene Bein soll auf oder über horizontaler Höhe gehalten werden.'],
  ['The rear foot is not hooked inwards with the toes pointing obliquely forwards', 'Der hintere Fuß ist nicht nach innen gehakt, wobei die Zehen schräg nach vorn zeigen'],
  ['The sole of sweeping foot leaves the ground after making contact for the sweeping action', 'Die Sohle des Schwungfußes verlässt nach dem Kontakt für die Schwungbewegung den Boden'],
  ['The sole of sweeping foot leaves the ground after making contact', 'Die Sohle des Schwungfußes verlässt nach dem Kontakt den Boden'],
  ['The sweeping leg is bent 45° or more', 'Das Schwungbein ist um 45° oder mehr gebeugt'],
  ['Sweeping leg is bent 45° or more', 'Das Schwungbein ist um 45° oder mehr gebeugt'],
  ['The sole of the front foot should not turn inward or touch the ground.', 'Die Sohle des vorderen Fußes soll sich nicht nach innen drehen oder den Boden berühren.'],
  ['The sole of the front foot turns inward and touches the ground', 'Die Sohle des vorderen Fußes dreht nach innen und berührt den Boden'],
  ['The sole of the sweeping foot should maintain contact with the ground throughout the sweeping action without leaving the ground after making contact.', 'Die Sohle des Schwungfußes soll während der gesamten Schwungbewegung Bodenkontakt halten und den Boden nach dem Kontakt nicht verlassen.'],
  ['The sole of the sweeping foot should maintain contact with the ground throughout the sweeping action.', 'Die Sohle des Schwungfußes soll während der gesamten Schwungbewegung Bodenkontakt halten.'],
  ['The spear does not rotate in an obvious vertical plane', 'Der Speer rotiert nicht in einer deutlich erkennbaren vertikalen Ebene'],
  ['The supporting leg must be completely straight without any bending.', 'Das Standbein muss vollständig gestreckt sein, ohne jede Beugung.'],
  ['The supporting leg is bent', 'Das Standbein ist gebeugt'],
  ['The thigh of supporting leg is above horizontal level', 'Der Oberschenkel des Standbeins ist über horizontaler Höhe'],
  ['The thigh of supporting leg is not at horizontal level', 'Der Oberschenkel des Standbeins ist nicht auf horizontaler Höhe'],
  ['The thigh of the bending front leg is not parallel to the ground', 'Der Oberschenkel des gebeugten vorderen Beins ist nicht parallel zum Boden'],
  ['The thigh of the supporting leg must be at horizontal level.', 'Der Oberschenkel des Standbeins muss auf horizontaler Höhe sein.'],
  ['The thrusting arm and spear shaft do not form a horizontal straight line', 'Stoßarm und Speerschaft bilden keine horizontale gerade Linie'],
  ['The thumb is not pressing on the second segment of both the index and middle fingers', 'Der Daumen drückt nicht auf das zweite Glied von Zeige- und Mittelfinger'],
  ['The thumb should be pressing on the second segment of both the index and middle fingers.', 'Der Daumen soll auf das zweite Glied von Zeige- und Mittelfinger drücken.'],
  ['The toes of the slapped foot should be above shoulder height and the slap should be audible.', 'Die Zehen des geschlagenen Fußes sollen über Schulterhöhe sein und der Schlag soll hörbar sein.'],
  ['The torso is below horizontal level', 'Der Oberkörper ist unter horizontaler Höhe'],
  ['The torso should be at or above horizontal level.', 'Der Oberkörper soll auf oder über horizontaler Höhe sein.'],
  ['The torso should be held below 45° from the horizontal level.', 'Der Oberkörper soll unter 45° zur Horizontalen gehalten werden.'],
  ['The two thighs are not crossed and closed together', 'Die beiden Oberschenkel sind nicht gekreuzt und geschlossen zusammengeführt'],
  ['The waist should be twisted toward the rear in the direction of the supporting leg.', 'Die Taille soll nach hinten in Richtung des Standbeins gedreht sein.'],
  ['Thigh of squatting leg is not parallel to the ground', 'Der Oberschenkel des hockenden Beins ist nicht parallel zum Boden'],
  ['Thigh of supporting leg is not at horizontal level', 'Der Oberschenkel des Standbeins ist nicht auf horizontaler Höhe'],
  ['Thighs not horizontal', 'Oberschenkel sind nicht horizontal'],
  ['Thumb is not bent and held in tightly', 'Der Daumen ist nicht gebeugt und eng angelegt'],
  ['Thumb is not pressing on the ring finger and little finger', 'Der Daumen drückt nicht auf Ringfinger und kleinen Finger'],
  ['Thumb not pressing on the ring finger and little finger', 'Der Daumen drückt nicht auf Ringfinger und kleinen Finger'],
  ['Toes of foot or feet pointing outward 45 degrees or more', 'Zehen eines Fußes oder beider Füße zeigen 45 Grad oder mehr nach außen'],
  ['Toes of slapped foot not above shoulder height', 'Zehen des geschlagenen Fußes sind nicht über Schulterhöhe'],
  ['Toes of slapped foot are not above shoulder height', 'Zehen des geschlagenen Fußes sind nicht über Schulterhöhe'],
  ['Toes of slapped foot not above shoulder level', 'Zehen des geschlagenen Fußes sind nicht über Schulterhöhe'],
  ['Torso held 45° or more above horizontal level', 'Oberkörper wird 45° oder mehr über horizontaler Höhe gehalten'],
  ['Torso is held 45° or more above horizontal level', 'Der Oberkörper wird 45° oder mehr über horizontaler Höhe gehalten'],
  ['Waist not twisted toward the rear in the direction of the supporting leg', 'Die Taille ist nicht nach hinten in Richtung des Standbeins gedreht'],
  ['Waist is not twisted toward the rear in the direction of the supporting leg', 'Die Taille ist nicht nach hinten in Richtung des Standbeins gedreht'],
  ['Weapon caught in a hugging manner', 'Die Waffe wird umklammernd gefangen'],
  ['Wrist is not hooked completely', 'Handgelenk ist nicht vollständig gehakt'],
  ['Wrist not hooked completely', 'Handgelenk ist nicht vollständig gehakt'],
]);

function translateTechnique(value) {
  if (value === 'the raised knee technique') {
    return 'die Technik mit angehobenem Knie';
  }

  return techniqueNames.get(value) || phrases.get(value) || value;
}

function translatePhrase(value) {
  const exact = categories.get(value) || techniqueNames.get(value) || phrases.get(value);
  if (exact) {
    return exact;
  }

  return findCaseInsensitive(categories, value) ||
    findCaseInsensitive(techniqueNames, value) ||
    findCaseInsensitive(phrases, value) ||
    null;
}

function translateDeductionSentence(value) {
  const prefixes = [
    ['Deductions are applied when:', 'Abzüge werden vergeben, wenn:'],
    ['A deduction is applied when', 'Ein Abzug wird vergeben, wenn'],
    ['Deduction is applied when', 'Ein Abzug wird vergeben, wenn'],
  ];

  for (const [source, target] of prefixes) {
    if (value.startsWith(source)) {
      let result = value.replace(source, target);
      for (const [english, german] of [...phrases].sort((a, b) => b[0].length - a[0].length)) {
        result = replaceAllInsensitive(result, english, german);
      }
      return result.replace(/, and (\d\))/g, ' und $1').replace(/ and (\d\))/g, ' und $1');
    }
  }

  return null;
}

function replaceAllInsensitive(value, search, replacement) {
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return value.replace(new RegExp(escaped, 'gi'), replacement);
}

function findCaseInsensitive(source, value) {
  const lowerValue = value.toLowerCase();
  for (const [english, german] of source) {
    if (english.toLowerCase() === lowerValue) {
      return german;
    }
  }

  return null;
}

function translateQuestion(value) {
  let match = value.match(/^What is the error code for '?(.+?)'?\?$/);
  if (match) {
    return `Wie lautet der Fehlercode für ${translateTechnique(match[1])}?`;
  }

  match = value.match(/^Which technique category does (.+) belong to\?$/);
  if (match) {
    return `Zu welcher Technikkategorie gehört ${translateTechnique(match[1])}?`;
  }

  match = value.match(/^What are the deduction points for (.+)\?$/);
  if (match) {
    return `Welche Abzugspunkte gelten für ${translateTechnique(match[1])}?`;
  }

  match = value.match(/^What are the two main deduction points for (.+)\?$/);
  if (match) {
    return `Welche zwei Hauptabzugspunkte gelten für ${translateTechnique(match[1])}?`;
  }

  match = value.match(/^What are the three main deduction points for (.+)\?$/);
  if (match) {
    return `Welche drei Hauptabzugspunkte gelten für ${translateTechnique(match[1])}?`;
  }

  match = value.match(/^What is the main deduction point for (.+)\?$/);
  if (match) {
    return `Was ist der wichtigste Abzugspunkt für ${translateTechnique(match[1])}?`;
  }

  const exact = new Map([
    ['How much bend in the sweeping leg results in a deduction?', 'Ab welcher Beugung des Schwungbeins gibt es einen Abzug?'],
    ['How should both legs be positioned in a correct Cé Shèn Píng Héng balance technique?', 'Wie sollen beide Beine bei einer korrekten Cé Shèn Píng Héng-Gleichgewichtstechnik positioniert sein?'],
    ['How should both legs be positioned in a correct Cé Ti Bảo Jiáo Zhi Li balance technique?', 'Wie sollen beide Beine bei einer korrekten Cé Ti Bảo Jiáo Zhi Li-Gleichgewichtstechnik positioniert sein?'],
    ['How should both legs be positioned in a correct Tân Hải Píng Héng balance technique?', 'Wie sollen beide Beine bei einer korrekten Tân Hải Píng Héng-Gleichgewichtstechnik positioniert sein?'],
    ['How should the fingers and wrist be positioned in a correct Gōu Shiòu (Hook)?', 'Wie sollen Finger und Handgelenk bei einer korrekten Gōu Shiòu (Hakenhand) positioniert sein?'],
    ['How should the fingers be positioned in a correct Jiàn Zhi (Sword Fingers)?', 'Wie sollen die Finger bei korrekten Jiàn Zhi (Schwertfingern) positioniert sein?'],
    ['How should the fingers be positioned in a correct Zhàng (Palm)?', 'Wie sollen die Finger bei einer korrekten Zhàng (Handfläche) positioniert sein?'],
    ['How should the foot be positioned in a correct raised knee technique?', 'Wie soll der Fuß bei einer korrekten Technik mit angehobenem Knie positioniert sein?'],
    ['How should the legs be aligned in a correct Die Shù Chà technique?', 'Wie sollen die Beine bei einer korrekten Die Shù Chà-Technik ausgerichtet sein?'],
    ['How should the legs be positioned in a correct Bán Jiao Chào Tian Zhi Li balance technique?', 'Wie sollen die Beine bei einer korrekten Bán Jiao Chào Tian Zhi Li-Gleichgewichtstechnik positioniert sein?'],
    ['How should the legs be positioned in Pán Tuì Píng Héng?', 'Wie sollen die Beine bei Pán Tuì Píng Héng positioniert sein?'],
    ['How should the supporting leg be positioned during a correct Cè Ti Tuí (Side Stretch Kick)?', 'Wie soll das Standbein bei einem korrekten Cè Ti Tuí (seitlicher Strecktritt) positioniert sein?'],
    ['How should the thumb be positioned in a correct Quán (Fist)?', 'Wie soll der Daumen bei einer korrekten Quán (Faust) positioniert sein?'],
    ['How should the waist be positioned in a correct Wàng Yuè Píng Héng balance technique?', 'Wie soll die Taille bei einer korrekten Wàng Yuè Píng Héng-Gleichgewichtstechnik positioniert sein?'],
    ['What deduction occurs if the supporting leg\'s thigh is above horizontal level?', 'Welcher Abzug erfolgt, wenn der Oberschenkel des Standbeins über horizontaler Höhe ist?'],
    ['What is the correct arm position for Shi Zi Píng Héng?', 'Was ist die korrekte Armposition bei Shi Zi Píng Héng?'],
    ['What is the correct execution of Tán Tuí?', 'Wie wird Tán Tuí korrekt ausgeführt?'],
    ['What is the correct foot position during a Hou Sao Tui sweep?', 'Was ist die korrekte Fußposition während eines Hou Sao Tui-Schwungs?'],
    ['What is the correct foot position for the front foot in Die Shù Chà?', 'Was ist die korrekte Fußposition des vorderen Fußes bei Die Shù Chà?'],
    ['What is the correct foot position for the supporting leg during Zhèng Ti Tuí?', 'Was ist die korrekte Fußposition des Standbeins während Zhèng Ti Tuí?'],
    ['What is the correct foot position for Ti Xi Dú Li?', 'Was ist die korrekte Fußposition bei Ti Xi Dú Li?'],
    ['What is the correct leg position at the apex of Zhèng Ti Tuí?', 'Was ist die korrekte Beinposition am höchsten Punkt von Zhèng Ti Tuí?'],
    ['What is the correct leg position for the supporting leg during Shi Zi Píng Héng?', 'Was ist die korrekte Beinposition des Standbeins während Shi Zi Píng Héng?'],
    ['What is the correct position for the raised leg in Wàng Yuè Píng Héng?', 'Was ist die korrekte Position des angehobenen Beins bei Wàng Yuè Píng Héng?'],
    ['What is the correct position for the raised leg in Yáng Shèn Píng Héng?', 'Was ist die korrekte Position des angehobenen Beins bei Yáng Shèn Píng Héng?'],
    ['What is the correct thigh position for the supporting leg in Kòu Tuì Píng Héng?', 'Was ist die korrekte Oberschenkelposition des Standbeins bei Kòu Tuì Píng Héng?'],
    ['What is the correct thigh position for the supporting leg in Pán Tuì Píng Héng?', 'Was ist die korrekte Oberschenkelposition des Standbeins bei Pán Tuì Píng Héng?'],
    ['What is the correct torso position for Shi Zi Píng Héng?', 'Was ist die korrekte Oberkörperposition bei Shi Zi Píng Héng?'],
    ['What is the correct torso position for Wàng Yuè Píng Héng?', 'Was ist die korrekte Oberkörperposition bei Wàng Yuè Píng Héng?'],
    ['What is the minimum angle requirement for the bent leg before extending in Chuài Tuí?', 'Welcher Mindestwinkel gilt für das gebeugte Bein, bevor es bei Chuài Tuí gestreckt wird?'],
    ['What is the minimum angle requirement for the bent leg before extending in Dēng Tuí?', 'Welcher Mindestwinkel gilt für das gebeugte Bein, bevor es bei Dēng Tuí gestreckt wird?'],
    ['What is the minimum angle requirement for the kicking leg in Tán Tuí?', 'Welcher Mindestwinkel gilt für das Trittbein bei Tán Tuí?'],
    ['What is the proper foot position during the sweep?', 'Was ist die korrekte Fußposition während des Schwungs?'],
    ["Why is this technique called 'Backward Leaning Balance'?", "Warum heißt diese Technik 'rückwärts geneigtes Gleichgewicht'?"],
    ["Why is this technique called 'Front Cross Legged Balance'?", "Warum heißt diese Technik 'Gleichgewicht mit vorn gekreuztem Bein'?"],
  ]);

  return exact.get(value) || null;
}

function translateString(value) {
  if (/^\d+$/.test(value)) return value;
  return translatePhrase(value) || translateDeductionSentence(value) || translateQuestion(value) || value;
}

function translateNode(node) {
  if (Array.isArray(node)) {
    return node.map(translateNode);
  }

  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, translateNode(value)]));
  }

  if (typeof node === 'string') {
    return translateString(node);
  }

  return node;
}

function copyDirectory(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (!entry.name.endsWith('.json')) {
      continue;
    }

    if (entry.name === 'index.json') {
      fs.copyFileSync(sourcePath, targetPath);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    fs.writeFileSync(targetPath, `${JSON.stringify(translateNode(data), null, 2)}\n`, 'utf8');
  }
}

fs.rmSync(targetRoot, { recursive: true, force: true });
copyDirectory(sourceRoot, targetRoot);
