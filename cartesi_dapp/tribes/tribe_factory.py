"""
Code for the Tribe Contract generator
"""

CONTRACT_BYTECODE = ''


def _set_bytecode(bytecode: bytes):
    """Set the current bytecode for new Tribe contracts

    Parameters
    ----------
    bytecode : bytes
        Tribe bytecode
    """
    global CONTRACT_BYTECODE
    CONTRACT_BYTECODE = bytecode


def get_tribe_bytecode() -> bytes:
    """Generate and return the bytecode for the new Tribe Contract to be
    deployed

    Returns
    -------
    bytes
        The compiled bytecode for the new contract
    """
    # Currently only return the current cached bytecode. In the future, this
    # can be used to create files from templates and compile the contract with
    # specific needs
    return CONTRACT_BYTECODE
