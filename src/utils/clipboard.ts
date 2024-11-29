export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // Convert base64 to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Create ClipboardItem
    const item = new ClipboardItem({
      [blob.type]: blob
    });
    
    // Write to clipboard
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.error('Failed to copy image:', error);
    return false;
  }
}