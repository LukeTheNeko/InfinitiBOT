const roles = require('../config/roles.json');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isSelectMenu() || interaction.customId !== 'cargoSelect') return;

    const rolesMap = {
      CS2: roles.CSID,
      Minecraft: roles.MinecraftID,
      GTAV: roles.gtaID,
      Valorant: roles.ValorantID,
      Fortnite: roles.FortniteID,
      Forza: roles.ForzaID,
      Notification: roles.NotificaID,
      Sorteios: roles.SorteiosID,
      // Add other mappings here if necessary
    };

    const selectedValue = interaction.values[0];

    if (!(selectedValue in rolesMap)) {
      await interaction.reply({ content: 'O cargo configurado não existe.', ephemeral: true });
      return;
    }

    const roleId = rolesMap[selectedValue];
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
      await interaction.reply({ content: 'O cargo configurado não existe.', ephemeral: true });
      return;
    }

    if (interaction.member.roles.cache.has(role.id)) {
      await interaction.member.roles.remove(role);
      await interaction.reply({ content: 'Cargo removido.', ephemeral: true });
      return;
    }

    await interaction.member.roles.add(role);
    await interaction.reply({ content: 'Cargo atribuído.', ephemeral: true });
  },
};