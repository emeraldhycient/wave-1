import { useEffect } from 'react';
import RNFS from 'react-native-fs';

import { cacheDirectory, makeDirectoryAsync, writeAsStringAsync, documentDirectory, EncodingType } from 'expo-file-system';

interface Ifile {
    Start: string;
    Stop: string;
    Word: string;
}

const useCreateSrtFile = async (srtData: Ifile[], videoFilename: string) => {
    const srtContent = srtData
        .map((item, index) => {
            // const endTime = addDurations(item?.Duration, item?.Offset);
            const entry = [
                (index + 1).toString(),
                `${item.Start} --> ${item?.Stop}`,
                item.Word,
            ];
            return entry.join('\n');
        })
        .join('\n\n');
    
    let filepath =""

    try {
        // Create the directory if it doesn't exist.
        const srtFolderPath = `${documentDirectory}wave`;
        await makeDirectoryAsync(srtFolderPath, { intermediates: true });

        // Define the SRT file path.
        const srtFilePath = `${srtFolderPath}/${videoFilename}.srt`.replace(/ /g, ''); // Remove spaces in the filename.

        filepath = srtFilePath
        // Write the SRT content to the file.
        await writeAsStringAsync(srtFilePath, srtContent, {
            encoding: EncodingType.UTF8,
        });
        

        console.log('SRT file saved successfully at:', srtFilePath);
    } catch (error) {
        console.error('Error writing or creating SRT file:', error);
    }
    console.log(filepath)

    return {
        srtContent,
        path: filepath,
    };
};

// function addDurations(time1: string, time2: string) {
//     const [h1, m1, s1WithFrac1] = time1.split(':').map(t => parseFloat(t));
//     const [h2, m2, s2WithFrac2] = time2.split(':').map(t => parseFloat(t));

//     const [s1, f1] = s1WithFrac1.toString().split('.').map(Number);
//     const [s2, f2] = s2WithFrac2.toString().split('.').map(Number);

//     let hours = h1 + h2;
//     let minutes = m1 + m2;
//     let seconds = s1 + s2;
//     let fraction = f1 + f2;

//     if (fraction >= 1000000) {
//         seconds += Math.floor(fraction / 1000000);
//         fraction = fraction % 1000000;
//     }

//     if (seconds >= 60) {
//         minutes += Math.floor(seconds / 60);
//         seconds = seconds % 60;
//     }

//     if (minutes >= 60) {
//         hours += Math.floor(minutes / 60);
//         minutes = minutes % 60;
//     }

//     return `${strPadded(hours)}:${strPadded(minutes)}:${strPadded(seconds)}.${fraction.toString().padStart(6, '0')}`;

//     function strPadded(n: number) {
//         return n.toString().padStart(2, '0');
//     }
// }

export default useCreateSrtFile;
export { Ifile };
// export { addDurations };



