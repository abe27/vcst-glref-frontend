import { useState } from "react";

const { Button, Modal, Text, Input } = require("@nextui-org/react");

const EnterQty = ({ isVisible = false, isConfirm = {} }) => {
  const [qty, setQty] = useState(0);
  const [visible, setVisible] = useState(false);

  const closeHandler = () => {
    setVisible(false);
    isConfirm(qty);
  };

  return (
    <>
      <Button auto color={"primary"} onPress={() => setVisible(isVisible)}>
        Add Now
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Enter Qty.
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="sm"
            placeholder="Qty"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeHandler}>
            Close
          </Button>
          <Button auto onPress={closeHandler}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnterQty;
