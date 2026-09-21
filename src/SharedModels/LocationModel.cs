namespace SharedModels
{
    public partial class LocationModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IPAddress { get; set; } = string.Empty;
    }
}