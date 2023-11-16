import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import Alert from "../helpers/alert";



async function requestPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
}

async function downloadAndSaveVideo(url: string, filename: string) {
    try {
        // Ensure permissions are granted
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            console.log('Permissions not granted');
            return;
        }

        // Download the file to a temporary URI
        const downloadRes = await FileSystem.downloadAsync(
            url,
            FileSystem.cacheDirectory + filename
        );

        const uri = downloadRes.uri;
        if (Platform.OS === 'android') {
            // On Android, move the file to the downloads directory
            const downloadsDirectory = FileSystem.documentDirectory + 'Downloads/';
            await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });
            const newUri = downloadsDirectory + filename;
            await FileSystem.moveAsync({
                from: uri,
                to: newUri,
            });
            Alert.success('File saved to Downloads' + newUri);
        } else {
            // On iOS, save the file to the gallery
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('Download', asset, false);
            Alert.success('File saved to Gallery');
        }
    } catch (error) {
        console.error('Error downloading and saving file:', error);
        Alert.error('Error downloading and saving file:' + error)
    }
}

export default downloadAndSaveVideo