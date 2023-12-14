import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import Alert from "../helpers/alert";
import * as Sharing from 'expo-sharing';

async function requestPermissions(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
}

async function downloadAndSaveVideo(videoUrl:string, filename:string): Promise<void> {
    // const filename = "exampleVideo.mp4"; // Change this to your video file name
    // const videoUrl = "https://example.com/video.mp4"; // Change this to your video URL

    try {
        const downloadRes = await FileSystem.downloadAsync(
            videoUrl,
            FileSystem.cacheDirectory + filename
        );

        if (Platform.OS === 'android') {
            await saveFile(downloadRes.uri, filename, 'video/mp4');
        } else {
            await shareAsync(downloadRes.uri);
        }
    } catch (error: any) {
        console.error('Error downloading video:', error);
        Alert.error('Error downloading video: ' + error.message);
    }
}

async function saveFile(uri: string, filename: string, mimetype: string): Promise<void> {
    if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted && permissions.directoryUri) {
            // Use the directory URI as provided by the Storage Access Framework
            const newUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype);
            await FileSystem.copyAsync({ from: uri, to: newUri });
            await shareAsync(newUri);
        } else {
            Alert.error('Storage permission not granted');
        }
    } else {
        await shareAsync(uri);
    }
}

async function shareAsync(url: string): Promise<void> {
    try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            alert('Sharing is not available on your platform');
            return;
        }

        await Sharing.shareAsync(url);
    } catch (error: any) {
        console.error('Error while sharing:', error);
        Alert.error('Error while sharing: ' + error.message);
    }
}

export default downloadAndSaveVideo;
