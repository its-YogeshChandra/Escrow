// Escrow Contract IDL
// Program ID: 8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm

export type EscrowContract = {
    "address": "8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm",
    "metadata": {
        "name": "escrow_contract",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "initialize",
            "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
            "accounts": [
                { "name": "maker", "writable": true, "signer": true },
                { "name": "token_mint" },
                { "name": "token_program" },
                { "name": "system_program", "address": "11111111111111111111111111111111" },
                { "name": "escrow_state_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [101, 115, 99, 114, 111, 119, 95, 115, 116, 97, 116, 101, 95, 97, 99, 99, 111, 117, 110, 116] }, { "kind": "account", "path": "maker" }, { "kind": "account", "path": "token_mint" }] } },
                { "name": "token_vault", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [116, 111, 107, 101, 110, 95, 118, 97, 117, 108, 116] }, { "kind": "account", "path": "escrow_state_account" }, { "kind": "account", "path": "token_mint" }] } },
                { "name": "maker_token_account", "writable": true }
            ],
            "args": [{ "name": "amount", "type": "u64" }]
        },
        {
            "name": "p2pswap",
            "discriminator": [95, 202, 112, 126, 191, 122, 80, 80],
            "accounts": [
                { "name": "maker", "writable": true, "signer": true },
                { "name": "taker", "writable": true, "signer": true },
                { "name": "input_token_mint" },
                { "name": "output_token_mint" },
                { "name": "token_program" },
                { "name": "system_program", "address": "11111111111111111111111111111111" },
                { "name": "escrow_state_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [101, 115, 99, 114, 111, 119, 95, 115, 116, 97, 116, 101, 95, 97, 99, 99, 111, 117, 110, 116] }, { "kind": "account", "path": "maker" }, { "kind": "account", "path": "output_token_mint" }] } },
                { "name": "maker_input_account", "writable": true },
                { "name": "maker_output_account", "writable": true },
                { "name": "taker_input_account", "writable": true },
                { "name": "taker_output_account", "writable": true },
                { "name": "vault_account", "writable": true }
            ],
            "args": [
                { "name": "input_amount", "type": "u64" },
                { "name": "output_amount", "type": "u64" }
            ]
        }
    ],
    "accounts": [
        {
            "name": "EscrowStateShape",
            "discriminator": [59, 0, 220, 239, 246, 235, 184, 226]
        }
    ],
    "errors": [
        { "code": 6000, "name": "InsufficientAmount", "msg": "insufficient amount to swap" },
        { "code": 6001, "name": "IncorrectInputAccount", "msg": "incorrect input account" },
        { "code": 6002, "name": "IncorrectOutputAccount", "msg": "incorrect output account " }
    ],
    "types": [
        {
            "name": "EscrowStateShape",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "maker", "type": "pubkey" },
                    { "name": "token_mint", "type": "pubkey" },
                    { "name": "vault_address", "type": "pubkey" },
                    { "name": "token_amount", "type": "u64" },
                    { "name": "bump", "type": "u8" }
                ]
            }
        }
    ]
};

export const IDL: EscrowContract = {
    "address": "8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm",
    "metadata": {
        "name": "escrow_contract",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "initialize",
            "discriminator": [175, 175, 109, 31, 13, 152, 155, 237],
            "accounts": [
                { "name": "maker", "writable": true, "signer": true },
                { "name": "token_mint" },
                { "name": "token_program" },
                { "name": "system_program", "address": "11111111111111111111111111111111" },
                { "name": "escrow_state_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [101, 115, 99, 114, 111, 119, 95, 115, 116, 97, 116, 101, 95, 97, 99, 99, 111, 117, 110, 116] }, { "kind": "account", "path": "maker" }, { "kind": "account", "path": "token_mint" }] } },
                { "name": "token_vault", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [116, 111, 107, 101, 110, 95, 118, 97, 117, 108, 116] }, { "kind": "account", "path": "escrow_state_account" }, { "kind": "account", "path": "token_mint" }] } },
                { "name": "maker_token_account", "writable": true }
            ],
            "args": [{ "name": "amount", "type": "u64" }]
        },
        {
            "name": "p2pswap",
            "discriminator": [95, 202, 112, 126, 191, 122, 80, 80],
            "accounts": [
                { "name": "maker", "writable": true, "signer": true },
                { "name": "taker", "writable": true, "signer": true },
                { "name": "input_token_mint" },
                { "name": "output_token_mint" },
                { "name": "token_program" },
                { "name": "system_program", "address": "11111111111111111111111111111111" },
                { "name": "escrow_state_account", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [101, 115, 99, 114, 111, 119, 95, 115, 116, 97, 116, 101, 95, 97, 99, 99, 111, 117, 110, 116] }, { "kind": "account", "path": "maker" }, { "kind": "account", "path": "output_token_mint" }] } },
                { "name": "maker_input_account", "writable": true },
                { "name": "maker_output_account", "writable": true },
                { "name": "taker_input_account", "writable": true },
                { "name": "taker_output_account", "writable": true },
                { "name": "vault_account", "writable": true }
            ],
            "args": [
                { "name": "input_amount", "type": "u64" },
                { "name": "output_amount", "type": "u64" }
            ]
        }
    ],
    "accounts": [
        {
            "name": "EscrowStateShape",
            "discriminator": [59, 0, 220, 239, 246, 235, 184, 226]
        }
    ],
    "errors": [
        { "code": 6000, "name": "InsufficientAmount", "msg": "insufficient amount to swap" },
        { "code": 6001, "name": "IncorrectInputAccount", "msg": "incorrect input account" },
        { "code": 6002, "name": "IncorrectOutputAccount", "msg": "incorrect output account " }
    ],
    "types": [
        {
            "name": "EscrowStateShape",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "maker", "type": "pubkey" },
                    { "name": "token_mint", "type": "pubkey" },
                    { "name": "vault_address", "type": "pubkey" },
                    { "name": "token_amount", "type": "u64" },
                    { "name": "bump", "type": "u8" }
                ]
            }
        }
    ]
};
