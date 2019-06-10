export interface InterfazBlkInfo {
    name_state: string,
    content: string,
    next_id: string,
    typing_time: string
}

export interface InterfazBlkInput {
    name_state: string,
    content: string,
    next_id: string,
    typing_time: string,
    validation: string,
    default_id: string,
    save_var: string
}

export interface InterfazBlkQR {
    name_state: string,
    content: string,
    options: [],
    next_id: string,
    typing_time: string,
    default_id: string,
    save_var: string
}


export interface InterfazBlkTicket {
    name_state: string,
    elements1: string,
    elements2: string,
    elements3: string,
    next_id1: string,
    next_id2: string,
    next_id3: string,
    typing_time: string,
    default_id: string,
    save_var: string
}
