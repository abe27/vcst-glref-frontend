/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const { Button, Modal, Text, Input } = require("@nextui-org/react");

const InputQty = ({ obj = {}, isConfirm = {} }) => {
  const [qty, setQty] = useState(0);
  const [visible, setVisible] = useState(false);

  const closeHandler = () => {
    setVisible(false);
    obj.fnqty = parseInt(qty);
    isConfirm(obj);
  };

  useEffect(() => {
    if (visible) {
      setQty(obj.fnqty);
    }
  }, [visible]);

  return (
    <>
      <Button light auto color={"default"} onPress={() => setVisible(true)}>
        {obj?.fnqty.toLocaleString()}
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
            id="qty"
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

export default InputQty;
