using Microsoft.AspNetCore.Mvc;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Services;
using TenetSystem.Infrastructure.Repositories;

namespace TenetSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentReceiptsController : ControllerBase
    {
        private readonly RentReceiptRepository _rentReceiptRepository;
        private readonly TenetSystemService _propertyService;

        public RentReceiptsController(
            RentReceiptRepository rentReceiptRepository,
            TenetSystemService propertyService)
        {
            _rentReceiptRepository = rentReceiptRepository;
            _propertyService = propertyService;
        }

        // GET: api/RentReceipts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RentReceipt>>> GetRentReceipts()
        {
            var receipts = await _rentReceiptRepository.GetAllAsync();
            return Ok(receipts);
        }

        // GET: api/RentReceipts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RentReceipt>> GetRentReceipt(int id)
        {
            var receipt = await _rentReceiptRepository.GetByIdAsync(id);
            
            if (receipt == null)
            {
                return NotFound();
            }

            return Ok(receipt);
        }

        // GET: api/RentReceipts/Unit/5
        [HttpGet("Unit/{unitId}")]
        public async Task<ActionResult<IEnumerable<RentReceipt>>> GetUnitRentHistory(int unitId)
        {
            var receipts = await _rentReceiptRepository.GetByUnitIdAsync(unitId);
            return Ok(receipts);
        }

        // POST: api/RentReceipts
        [HttpPost]
        public async Task<ActionResult<RentReceipt>> PostRentReceipt(RentReceipt rentReceipt)
        {
            await _rentReceiptRepository.AddAsync(rentReceipt);
            return CreatedAtAction(nameof(GetRentReceipt), new { id = rentReceipt.Id }, rentReceipt);
        }

        // POST: api/RentReceipts/Record
        [HttpPost("Record")]
        public async Task<ActionResult> RecordRentPayment([FromBody] RentPaymentRequest request)
        {
            await _propertyService.RecordRentPaymentAsync(
                request.TenantId,
                request.UnitId,
                request.Amount,
                request.RentMonth,
                request.PaymentMethod,
                request.Notes);
                
            return Ok();
        }

        // PUT: api/RentReceipts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRentReceipt(int id, RentReceipt rentReceipt)
        {
            if (id != rentReceipt.Id)
            {
                return BadRequest();
            }

            await _rentReceiptRepository.UpdateAsync(rentReceipt);
            return NoContent();
        }

        // DELETE: api/RentReceipts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRentReceipt(int id)
        {
            await _rentReceiptRepository.DeleteAsync(id);
            return NoContent();
        }

        public class RentPaymentRequest
        {
            public int TenantId { get; set; }
            public int UnitId { get; set; }
            public decimal Amount { get; set; }
            public DateTime RentMonth { get; set; }
            public string PaymentMethod { get; set; }
            public string Notes { get; set; }
        }
    }
}