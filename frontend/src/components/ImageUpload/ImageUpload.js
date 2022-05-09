import React, { useRef, useState, useEffect} from "react";

const ImageUpload = (props) => {
    //const [previewURL, setPreviewURL] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {
        if (!props.file){
            return;
        }
        const fileReader = new FileReader();
        //fileReader.onload = () => {
        //    setPreviewUrl(fileReader.result);
        //};
        fileReader.readAsDataURL(props.file);
    }, [props.file]);

    const pickedHandler = (event) => {
        let pickedFile;
        if(event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            props.setFile(pickedFile);
            setIsValid(true);
        } else {
            setIsValid(false);
        }        
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (

        <div className="form-control">
            <input id={props.id} ref={filePickerRef} type="file" accept=".jpg, .png, .jpeg" onChange={pickedHandler} />
            <div className={`image-upload ${props.center && "center"}`}>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;