use anchor_lang::prelude::*;

declare_id!("8n6tXMhBaJ67C6nmWZ71e5voHnygzxLEHNenxVrrnbnm");

#[program]
pub mod escrow_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
