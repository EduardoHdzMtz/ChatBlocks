export interface InterfazChatBot {
    id_robot: string,
    name_robot: string,
    id_face: string;
    block_ini: string,
    type_blocki: string,
    access_token: string,
    api_nlp: string,
    id_user: string
}

export interface InterfazViewBlkInfo {
    id_block: string,
    namestate: string,
    id_robot: string;
    contenido: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    contenttype: string,
    typingtime: string,
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazViewBlkInfoDin {
    id_block: string,
    namestate: string,
    id_robot: string;
    contenido: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    contenttype: string,
    typingtime: string,
    linksAPI: any[];
    credenciales: any[];
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazLinksAPI {
    id_link: string,
    blocktype: string,
    links: string,
    id_block: string
}

export interface InterfazCredencialesAPI {
    id_credencial: string,
    id_block: string,
    blocktype: string,
    namecredencial: string,
    credencial: string
}

export interface InterfazViewBlkInput {
    id_block: string,
    namestate: string,
    id_robot: string,
    contenido: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    contenttype: string,
    typingtime: string,
    validacion: string,
    default_id: string,
    save_var: string,
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazViewBlkInputDin {
    id_block: string,
    namestate: string,
    id_robot: string,
    contenido: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    contenttype: string,
    typingtime: string,
    validacion: string,
    default_id: string,
    save_var: string,
    linksAPI: any[];
    credenciales: any[];
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazViewBlkQR{
    id_block: string,
    namestate: string,
    id_robot: string,
    contenido: string,
    opc_nextid: string,
    opciones: string,
    next_id: string,
    blocktype: string,
    typingtime: string,
    default_id: string,
    save_var: string,
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazViewBlkQRDin{
    id_block: string,
    namestate: string,
    id_robot: string,
    contenido: string,
    opc_nextid: string,
    opciones: string,
    next_id: string,
    blocktype: string,
    typingtime: string,
    default_id: string,
    save_var: string,
    linksAPI: any[];
    credenciales: any[];
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}


export interface InterfazBotones{
    id_boton: string,
    id_elemento: string,
    titlebutton: string,
    typebutton: string,
    contentbutton: string
}

export interface InterfazElementosS{
    id_elements: string,
    id_block: string,
    blocktype:string,
    title: string,
    image_url: string,
    subtitle: string,
    opc_nextid: string,
    next_id: string,
    botones: any[];    
}

export interface InterfazViewBlkSlide{
    id_block: string,
    namestate: string,
    id_robot: string,
    elementos: any[],
    opc_elm: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    typingtime: string,
    default_id: string,
    save_var: string,
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazViewBlkSlideDin {
    id_block: string,
    namestate: string,
    id_robot: string;
    contenido: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    typingtime: string,
    default_id: string,
    save_var: string
    linksAPI: any[];
    credenciales: any[];
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}



export interface InterfazViewBlkSlideBuy{
    id_block: string,
    namestate: string,
    id_robot: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    typingtime: string,
    default_id: string,
    save_var: string,
    id_elements: string,
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}

export interface InterfazViewBlkTicket{
    id_block: string,
    namestate: string,
    id_robot: string,
    opc_nextid: string,
    next_id: string,
    blocktype: string,
    typingtime: string,
    currency: string,
    rescue_var: string,
    shipping_cost: string,
    total_taxes: string,
    street1_var: string,
    street2_var: string,
    city_var: string,
    pc_var: string,
    state_var: string,
    country_var: string,
    paymethod_var: string,
    nameu_var: string,
    pos_x: number,
    pos_y: number,
    tags_entradas: any[];
}


