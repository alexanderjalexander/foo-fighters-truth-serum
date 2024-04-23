import React, {useState} from "react";
import {useFlagDetection} from "../../query/detections";
import {Button, Form, Modal} from "react-bootstrap";

export default function FlagDetection(id, personDataQuery) {
    const [flagDetection, setFlagDetection] = useState({
        flagging: false, error: '', showModal: false, id: '', name: ''
    })
    const HideFlagDetectionModal = () => setFlagDetection({...flagDetection, showModal: false})
    const flagDetectionMutation = useFlagDetection();
    const onFlagDetection = async (e) => {
        e.preventDefault();
        try {
            setFlagDetection({...flagDetection, error: '', flagging: true})
            await flagDetectionMutation.mutateAsync({id:flagDetection.id})
            await personDataQuery.refetch();
            setFlagDetection({id: '', name: '', error: '', flagging: false, showModal: false})
        } catch (e) {

            console.error('Edit Detection Form Mutation Failed');
            setFlagDetection({...flagDetection, error: (e.message)})
        }
    }

    const flagDetectionModal = (
        <div>
            {flagDetection.showModal && <Modal show={flagDetection.showModal} onHide={HideFlagDetectionModal} backdrop="static">
                <Form onSubmit={onFlagDetection}>
                    <Modal.Header closeButton>
                        <Modal.Title>Flag Detection: {flagDetection.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>Are you sure you want to flag this detection? Flagging this detection will irreversibly mark it as incorrect.</div>
                        {flagDetection.error === ''
                            ? <div></div>
                            : <label id='flagError' className='text-danger'>{flagDetection.error}</label>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                                onClick={() => setFlagDetection({...flagDetection, showModal: false})}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="danger" id='flagDetectionSubmit'
                                disabled={flagDetection.flagging}>
                            {flagDetection.flagging ? 'Flagging...' : 'Flag'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>}
        </div>
    )

    return {flagDetection, setFlagDetection, flagDetectionModal}
}