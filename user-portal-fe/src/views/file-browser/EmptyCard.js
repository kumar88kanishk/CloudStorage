import NoFileUploaded from 'assets/images/icons/no_file_uploaded.svg'

const EmptyCard = () => {

  return (
    <>
      <center style={{ top: "30%", left: "45%", position: 'fixed' }}>
        <img src={NoFileUploaded} height="250" alt="no-file-upload" /><br />
        No files are uploaded, please start uploading files
      </center>

    </>
  )
}


export default EmptyCard;