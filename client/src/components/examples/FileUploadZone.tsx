import { FileUploadZone } from '../FileUploadZone';

export default function FileUploadZoneExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FileUploadZone onFilesChange={(files) => console.log('Files changed:', files)} />
    </div>
  );
}
